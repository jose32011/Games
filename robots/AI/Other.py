from __future__ import generators
import plus
import AI
from AI import vector3
import Arenas
import Gooey
import math
import Tactics

class LittleMetalFriend(AI.SuperAI):
    "Pushes and grabs!"
    name = "LittleMetalFriend"

    def __init__(self, **args):
        AI.SuperAI.__init__(self, **args)

        self.tactics.append(Tactics.Charge(self))
        self.tactics.append(Tactics.Shove(self))

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
            
            self.RegisterSmartZone("squeeze", 1)
            
        return AI.SuperAI.Activate(self, active)

    def Tick(self):
        targets = [x for x in self.sensors.itervalues() if x.contacts > 0]
        if len(targets) > 0:
            # TODO: squeeze and push? or whip?
            self.Input("Lefthook", 0, -100)
            self.Input("Righthook", 0, -100)
        else:
            # TODO: open arms back up?
            self.Input("Lefthook", 0, 0)
            self.Input("Righthook", 0, 0)
            
        return AI.SuperAI.Tick(self)

    def DebugString(self, id, string):
        if self.debug:
            if id == 0: self.debug.get("line0").setText(string)
            elif id == 1: self.debug.get("line1").setText(string)
            elif id == 2: self.debug.get("line2").setText(string)
            elif id == 3: self.debug.get("line3").setText(string)
        
AI.register(LittleMetalFriend)
