import plus
import AI

class NoBrain(AI.SuperAI):
    "AI that does nothing."
    name = "No Brain"

    def __init__(self, **args):
        self.total = 0
        self.delay = 20
        #self.delay = args.get('rate')
        
        AI.SuperAI.__init__(self)

    def Tick(self):
        # do our stuff here
    
        self.total += self.tickInterval
        if self.total > self.delay:
            self.total = 0

        return AI.SuperAI.Tick(self)

AI.register(NoBrain)
