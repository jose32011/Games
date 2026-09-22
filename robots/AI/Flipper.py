from __future__ import generators
import plus
import AI
from AI import vector3
import Arenas
import Gooey
import math
import Tactics

class UpsideDownTracker:
    def __init__(self):
        self.last_time = 0
        self.last_position = None
        self.invertible = False
        
class Flipper(AI.SuperAI):
    "Flipper strategy"
    name = "Flipper"

    def __init__(self, **args):
        AI.SuperAI.__init__(self, **args)
               
        self.zone = "flip"
        self.trigger = "Flip"
        
        self.upTrack = {}       # for seeing if enemies can drive upside down
        
        self.tactics.append(Tactics.Engage(self))
        
    def Activate(self, active):
        if active:
            if AI.SuperAI.debugging:
                self.debug = Gooey.Plain("watch", 0, 75, 100, 75)
                tbox = self.debug.addText("line0", 0, 0, 100, 15)
                tbox.setText("Throttle")
                tbox = self.debug.addText("line1", 0, 15, 100, 15)
                tbox.setText("Turning")
                tbox = self.debug.addText("line2", 0, 30, 100, 15)
                tbox.setText("")
                tbox = self.debug.addText("line3", 0, 45, 100, 15)
                tbox.setText("")
            
            self.RegisterSmartZone(self.zone, 1)
            
        return AI.SuperAI.Activate(self, active)

    def Tick(self):
        # fire weapon (but only if the target is not upside down already)
        if self.weapons:
            targets = [x.robot for x in self.sensors.itervalues() if x.contacts > 0 \
                and not plus.isDefeated(x.robot)]
            
            fire = False
            for bot in targets:
                if not plus.isUpsideDown(bot) or self.CanDriveUpsideDown(bot):
                    fire = True
                
            if fire: self.Input(self.trigger, 0, 1)
            
        return AI.SuperAI.Tick(self)

    def CanDriveUpsideDown(self, bot):
        MOVE_THRESHOLD = 3.0
        
        if bot in self.upTrack:
            t = self.upTrack[bot]
            if t.invertible: return True
            else:
                # check to see if he's moved recently
                position = plus.getLocation(bot)
                time = plus.getTimeElapsed()
                if time - t.last_time > 10:
                    # this record is too old to be reliable
                    t.last_time = time
                    t.last_position = position
                    return False
                v0 = vector3(t.last_position)
                v1 = vector3(position)
                if (v1-v0).length() > MOVE_THRESHOLD: t.invertible = True
                return t.invertible
        else:
            t = UpsideDownTracker()
            t.last_position = plus.getLocation(bot)
            t.last_time = plus.getTimeElapsed()
            self.upTrack[bot] = t
            
            return False
            
    def InvertHandler(self):
        # fire weapon once per second (until we're upright!)
        while 1:
            self.Input(self.trigger, 0, 1)
            
            for i in range(0, 8):
                yield 0
                
    def LostComponent(self, id):
        # if we lose all our weapons, stop using the Engage tactic and switch to Shove
        if id in self.weapons: self.weapons.remove(id)
        
        if not self.weapons:
            tactic = [x for x in self.tactics if x.name == "Engage"]
            if len(tactic) > 0:
                self.tactics.remove(tactic[0])
                
                self.tactics.append(Tactics.Shove(self))
                self.tactics.append(Tactics.Charge(self))
            
        return AI.SuperAI.LostComponent(self, id)
        
    def DebugString(self, id, string):
        if self.debug:
            if id == 0: self.debug.get("line0").setText(string)
            elif id == 1: self.debug.get("line1").setText(string)
            elif id == 2: self.debug.get("line2").setText(string)
            elif id == 3: self.debug.get("line3").setText(string)
    
AI.register(Flipper)
