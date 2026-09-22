"Initialize the AI module"

from __future__ import generators

import plus
import sys
import math
import Bindings
import Arenas

ai_bindings = []        # list of AI scripts & which bots use them
ai_list = []            # list of all AI scripts
running_ai = []         # list of AI we've created

############################################################################
#
# scheduler
#
############################################################################

class scheduler:
    "A 'brain' to schedule a set of actions."
    resume = 0
    done = 1
    abort = 99

    def __init__(self):
        self.actions = []

    def setActions(self, actions):
        self.actions = actions

    def tick(self):
        "Run the top action and pop them off as they're completed."
        if len(self.actions) > 0:
            result = apply(self.actions[0][0], self.actions[0][1])
            if result == scheduler.abort:
                return False
            elif result == scheduler.done:
                # this step is done, move to next
                self.actions.pop(0)
                return len(self.actions) > 0
            else:
                return True
        else:
            return False

############################################################################
#
# SuperAI
#
############################################################################

class SuperAI(plus.AI):
    "Python base class of the C++ AI."
    name = "No Name"

    debugging = plus.isDebugMode()

    def __init__(self, **args):
        import Tactics

        plus.AI.__init__(self)

        self.bActivated = False

        self.countdownToEvaluation = 0
        self.tactics = []
        self.lastTactic = None
        self.enemy_id = None

        self.zone = None
        self.sensors = {}               # used to track SmartZones
        self.weapons = []               # used to track our weapons
        self.timeOfLastGoodHit = 0

        self.tickCounter = 0

        self.debug = None

        self.bImmobile = False
        self.immobile_list = {}
        self.bInvertible = False
        self.bCarSteering = False

        # customize these for each robot
        self.top_speed = 4.0
        self.max_throttle = 100
        self.max_turn_speed = 2.5
        self.max_turn = 60
        self.fRadius = 1.0

        self.boost_throttle = self.max_throttle
        self.boost_turn = self.max_turn

        self.last_throttle = self.set_throttle = 0
        self.last_turn_throttle = self.set_turn_throttle = 0

        # DEFAULT TACTICS:

        self.tactics.append(Tactics.Invert(self, self.InvertHandler()))
        self.tactics.append(Tactics.Unstuck(self, self.StuckHandler()))

        if plus.getGameType() == "TABLETOP":
            self.tactics.append(Tactics.AvoidEdges(self))
            self.tactics.append(Tactics.PushOffEdge(self))
        elif plus.getGameType() == "KING OF THE HILL":
            self.tactics.append(Tactics.Dethrone(self))
            self.tactics.append(Tactics.Reign(self))

        if 'nose' in args: self.fNoseOffset = args['nose']
        if 'topspeed' in args: self.top_speed = args['topspeed']
        if 'throttle' in args: self.max_throttle = args['throttle']
        if 'turnspeed' in args: self.max_turn_speed = args['turnspeed']
        if 'turn' in args: self.max_turn = args['turn']
        if 'invertible' in args: self.bInvertible = args['invertible']
        if 'car' in args: self.bCarSteering = args['car']
        if 'weapons' in args: self.weapons = list(args['weapons'])
        if 'radius' in args: self.fRadius = args['radius']

    def describe(self):
        "Print out all component id's and types for this robot."
        for i in range(0, self.GetNumComponents()):
            print i, self.GetComponentType(i), self.GetComponentHealth(i)

    def Activate(self, active):
        if not active:
            # clear out tactics so references go away
            self.tactics = []
            self.lastTactic = None

            # stop all components
            # CB: this was causing a "lurch" at the end of matches so I took it out (1/8)
            #self.ResetComponents()
            # CB: using this instead:
            self.Turn(0)
            self.Throttle(0)

        self.bActivated = active

        return plus.AI.Activate(self, active)

    def ImmobilityWarning(self, id, on):
        if on:
            self.immobile_list[id] = plus.getTimeElapsed()
        elif id in self.immobile_list:
            del self.immobile_list[id]
            
        if id == self.GetID():
            # keep track of our own immobility warning
            self.bImmobile = on

        plus.AI.ImmobilityWarning(self, id, on)

    def InvertHandler(self):
        "This default generator is called when the bot is upside-down."
        # try driving full speed in all 8 directions for 1/2 second each
        while 1:
            for x in range(-1, 2):
                for y in range(1, -2, -1):
                    if x or y:
                        for wait in range(0, 4):
                            self.Throttle(y * 100)
                            self.Turn(x * 100)
                            yield 0

    def StuckHandler(self):
        "This default generator is called when the bot is almost immobile."
        while 1:
            # back up for 2 seconds (will stop once we're not immobile)
            for i in range(0, 16):
                pos = vector3(self.GetLocation())
                dir = vector3(self.GetDirection())
                self.DriveToLocation((pos - dir * 3).asTuple(), True)
                yield 0
            # go forward for 2 seconds
            for i in range(0, 16):
                pos = vector3(self.GetLocation())
                dir = vector3(self.GetDirection())
                self.DriveToLocation((pos + dir * 3).asTuple())
                yield 0

    def PlayerOut(self, id):
        # should remove dead players from immobile list or we might wait too long
        #  to "unstick" ourselves because we're waiting for them

        if id in self.immobile_list: del self.immobile_list[id]

        return True
        
    def ReThink(self):
        self.Think()
                
    def Tick(self):
        if self.bActivated:
            self.tickCounter += 1

            # refresh sensors once per second
            if self.tickCounter >= 8:
                self.tickCounter = 0
                self.CheckSensors()

            # reevaluate tactics every second
            if self.countdownToEvaluation <= 0: self.Think()
            else:
                self.countdownToEvaluation -= 1

                # execute current action plan
                running = False

                if len(self.tactics) > 0:
                    running = self.tactics[0].Execute()
                    self.lastTactic = self.tactics[0]

                # reevaluate whenever current tactic stops running
                if not running or self.countdownToEvaluation <= 0: self.Think()

            self.last_throttle = self.set_throttle
            self.last_turn_throttle = self.set_turn_throttle

            self.CheckForWeaponHits()

        return plus.AI.Tick(self)

    def Think(self):
        self.Evaluate()
        self.countdownToEvaluation = 8
        # shut down motors while we think
        self.Throttle(0)
        self.Turn(0)

    def Evaluate(self):
        for each in self.tactics:
            each.Evaluate()

        # sort tactics by highest priority
        self.tactics.sort(Tactic.sortByPriority)

        for i in range(0, min(2, len(self.tactics))):
            self.DebugString(2 + i, self.tactics[i].name + ": " + \
                str(self.tactics[i].priority))

    def RemoveTactic(self, name):
        self.tactics = [x for x in self.tactics if x.name != name]
        
    def GetNearestEnemy(self):
        closest = None
        min_dist = 9999
        min_weighted_dist = 9999

        enemies = self.GetEnemies()

        # target human players first
        for enemy in enemies:
            dist = self.GetDistanceToID(enemy)
            weighted_dist = dist
            if not plus.isHuman(enemy): weighted_dist += 3
            if weighted_dist < min_weighted_dist:
                closest = enemy
                min_weighted_dist = weighted_dist
                min_dist = dist

        return closest, min_dist

    def GetPath(self, from_world, to_world):
        a = Arenas.currentArena
        if a:
            a.SetSearchRadius(self.fRadius)
            return list(a.GetPath(from_world, to_world, False))
        else:
            return []

    def IsStraightPathClear(self, from_world, to_world):
        a = Arenas.currentArena
        if a:
            a.SetSearchRadius(self.fRadius)
            return a.IsStraightPathClear(from_world, to_world, False)
        else:
            return False
                      
    def DebugString(self, id, string):
        pass

    def Throttle(self, throttle):
        # if we're car steering and we're not moving much, throttle up
        if self.bCarSteering and self.last_turn_throttle != 0:
            speed = self.GetSpeed()
            if speed > 0 and speed < self.top_speed / 3: throttle = self.last_throttle + 10
            elif speed < 0 and speed > -self.top_speed / 3: throttle = self.last_throttle - 10

        throttle = min(max(throttle, -100), 100)

        if self.bInvertible and self.IsUpsideDown(): throttle = -throttle

        self.set_throttle = throttle
        self.Input('Forward', 0, throttle)
        self.DebugString(0, "Throttle = " + str(int(throttle)))
        
    def Turn(self, turning):
        turning = min(max(turning, -100), 100)

        if self.bInvertible and self.IsUpsideDown(): turning = -turning

        self.set_turn_throttle = turning
        self.Input('LeftRight', 0, -turning)
        self.Input('LeftRight', 1, turning)
        self.DebugString(1, "Turning = " + str(int(turning)))
        
    def DriveToWaypoints(self, waypoints, in_reverse = False):
        throttle = 0
        found = False
        
        while len(waypoints) > 0 and not found:
            grid = waypoints[0]
            pos = Arenas.currentArena.FromGrid(grid)
            dist = self.GetDistanceTo(pos)
            dir = 1
            
            if in_reverse: dir = -1
            
            if dist < 1:
                waypoints.pop(0)
            else:
                # drive to this point
                h = self.GetHeadingTo(pos, in_reverse)
                self.AimToHeading(h, in_reverse)
                speed = self.GetSpeed()

                # slow down if we have to turn sharply
                if dist < abs(speed) and (h > .4 or h < -.4):
                    throttle = 0
                    self.boost_throttle = self.max_throttle
                else:
                    if speed * dir < self.top_speed:
                        h = max(min(h, .4), -.4)
                        # drive slower the more we need to turn our heading
                        mps = dir * (.5 - abs(h)) * self.top_speed

                        # boost throttle if we're not going as fast as we'd like
                        if (dir > 0 and speed < mps) or (dir < 0 and speed > mps):
                            self.boost_throttle += (self.max_throttle * .1)

                        throttle = dir * (.5 - abs(h)) * self.boost_throttle
                    else:
                        throttle = 0
                        self.boost_throttle = self.max_throttle
                        
                found = True
        
        self.Throttle(throttle)
        
        if len(waypoints) == 0:
            self.Turn(0)
            self.Throttle(0)
            
        return found
               
    def AimToHeading(self, heading, in_reverse = False):
        THRESHOLD = .05
        turn = 0
        
        if heading > math.pi: heading -= 2 * math.pi
        elif heading < -math.pi: heading += 2 * math.pi
        
        if (heading < -THRESHOLD or heading > THRESHOLD):
            turning_speed = self.GetTurning()
            
            dir = 1
            if heading < 0: dir = -1

            if abs(turning_speed) < self.max_turn_speed:
                h = min(abs(heading), 1.75)

                rps = dir * int((h / 1.5) * self.max_turn_speed)

                # stop turning if we're turning too fast
                if (heading > 0 and turning_speed * self.tickInterval > heading) \
                    or (heading < 0 and turning_speed * self.tickInterval < heading):
                    turn = 0
                    self.boost_turn = self.max_turn

                # boost turn if we're not turning as fast as we'd like
                if (dir > 0 and turning_speed < rps) or (dir < 0 and turning_speed > rps):
                    self.boost_turn += self.max_turn

                turn = dir * int((h / 1.5) * self.boost_turn)
            else:
                self.boost_turn = self.max_turn
                turn = 0

            self.Turn(turn)
            return True
        else:
            self.boost_turn = self.max_turn
            self.Turn(0)
            return False

    def DriveToLocation(self, world_location, in_reverse = False, update_path = True, last_path = []):
        if self.GetDistanceTo(world_location) > 1:
            if update_path:
                a = Arenas.currentArena
                a.SetSearchRadius(self.fRadius)
                waypoints = list(a.GetPath(self.GetLocation(), world_location, False))
            else:
                waypoints = last_path
            
            if len(waypoints) > 0:
                return self.DriveToWaypoints(waypoints, in_reverse)
            else:
                return False
        else:
            self.Throttle(0)
            self.Turn(0)
            return False

    def SmartZoneEvent(self, direction, id, robot, chassis):
        if robot > 0:
            r = robot - 1
            if not r in self.sensors:
                self.sensors[r] = Sensor(r, chassis)
            
            entry = self.sensors[r]
            
            if direction == 1:
                entry.contacts += 1
                if chassis: entry.chassis = True
            elif direction == -1:
                entry.contacts -= 1
                if chassis or entry.contacts == 0: entry.chassis = False

        return True

    def RobotInRange(self, robot_id):
        "Default robot sensor: returns tuple of (part-of-robot-in-range, chassis-in-range)"
        if robot_id in self.sensors:
            entry = self.sensors[robot_id]
            return (entry.contacts > 0, entry.chassis)
        else:
            return (False, False)

    def FractureEvent(self):
        "Time to refresh the sensors."
        self.CheckSensors()

    def CheckSensors(self):
        if self.zone:
            self.sensors = {}
            results = self.GetZoneContents(self.zone)
            for reading in results:
                self.SmartZoneEvent(1, 1, reading[0], reading[1])

    def CheckForWeaponHits(self):
        # check our list of weapons, see if they match LastDamageDone
        #  and, if it's a big enough hit, record the time of that hit
        damage = self.GetLastDamageDone()
        for weapon in self.weapons:
            if weapon == damage[0] and damage[1] > 10.0:    # min damage = 10
                self.timeOfLastGoodHit = damage[2]
                
    def WeaponHitRecently(self, x):
        "Have we had a good solid hit in the last x seconds."
        return (plus.getTimeElapsed() - self.timeOfLastGoodHit) < x

############################################################################
#
# Tactic
#
############################################################################

class Tactic:
    name = ""

    def __init__(self, ai):
        self.ai = ai
        self.target_id = None       # which enemy is this tactic targeting (ai has its own "enemy_id" for the current enemy)
        self.priority = 0

    def Evaluate(self):
        pass

    def Execute(self):
        return True

    def sortByPriority(x, y):
        if x.priority > y.priority: return -1
        elif x.priority < y.priority: return 1
        else: return 0

############################################################################
#
# Sensor
#
############################################################################

class Sensor:
    "Class to manage SmartZone readings."
    def __init__(self, robot, chassis):
        self.robot = robot
        self.chassis = chassis
        self.contacts = 0
    def __eq__(a, b):
        return a.robot == b.robot

############################################################################
#
# helper functions
#
############################################################################

def register(ai):
    if issubclass(ai, SuperAI):
        print "Registering", ai.name
        ai_list.append(ai)

def createAIForRobot(name):
    list = [x for x in ai_bindings if x[0] == name]
    if len(list) > 0:
        print "Creating AI for", name
        ai = [x for x in ai_list if x.name == list[0][1]]
        if len(ai) > 0:
            print "Script = ", ai[0].name
            # create new AI, with variable arguments
            new = None

            try:
                if len(list[0]) >= 3:
                    new = ai[0](**list[0][2])
                else:
                    new = ai[0]()
                running_ai.append(new)
            except:
                import traceback
                traceback.print_exc()

            return new

    raise ValueError, "Couldn't find AI for " + name

def copyAI(ai_number):
    name = running_ai[ai_number].__class__.name
       
    ai = [x for x in ai_list if x.name == name]
    if len(ai) > 0:
        a = ai[0]()
        running_ai.append(a)
        return a

def clearAISource(ai_number):
    ai = [x for x in ai_list if x == running_ai[ai_number].__class__]
    if len(ai) > 0:
        ai_list.remove(ai[0])
        return 1
    else:
        return 0

def clearRunningAI():
    # running_ai has to be declared global because, as it is, it could be local
    global running_ai
    running_ai = []
    #print "All running AI deactivated"

def getSourceFileForAI(ai_number):
    "Return source file for this currently running ai -- must return a list."
    return [sys.modules[running_ai[ai_number].__class__.__module__].__file__]

############################################################################
#
# vector3
#
############################################################################

class vector3:
    def __init__(self, *args):
        import types
        if len(args) == 3:
            self.x, self.y, self.z = args
        else:
            if type(args[0]) is types.TupleType:
                self.x, self.y, self.z = args[0][0], args[0][1], args[0][2]
            else:
                # vector from heading
                self.y = 0
                self.x = math.sin(args[0])
                self.z = math.cos(args[0])
    def __add__(a, b):
        return vector3(a.x + b.x, a.y + b.y, a.z + b.z)
    def __sub__(a, b):
        return vector3(a.x - b.x, a.y - b.y, a.z - b.z)
    def __mul__(a, b):
        return vector3(a.x * b.x, a.y * b.y, a.z * b.z)
    def __mul__(a, scale):
        return vector3(a.x * scale, a.y * scale, a.z * scale)
    def __div__(a, b):
        return vector3(a.x / b.x, a.y / b.y, a.z / b.z)
    def length(self):
        return math.sqrt(self.x * self.x + self.y * self.y + self.z * self.z)
    def dot(self, other):
        return self.x * other.x + self.y * other.y + self.z * other.z
    def normalize(self):
        l = self.length()
        self.x = self.x / l
        self.y = self.y / l
        self.z = self.z / l
        return self
    def asTuple(self):
        return (self.x, self.y, self.z)
    def __repr__(self):
        return str(self.asTuple())
    def move(self, angle, distance):
        dir = vector3(math.sin(angle), 0, math.cos(angle))
        self += dir * distance
        return self

############################################################################
#
# code to execute
#
############################################################################

Bindings.load(ai_bindings)
