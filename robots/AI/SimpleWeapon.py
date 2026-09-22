import plus
import AI

class SimpleWeapon(AI.SuperAI):
    "Executes its 'Fire!' input every 5 seconds."
    name = "Simple Weapon"

    def __init__(self, **args):
        self.total = 0
        self.delay = args.get('rate')
        AI.SuperAI.__init__(self)

    def Tick(self):
        # do our stuff here
        self.total += self.tickInterval
        if self.total > self.delay:
            #fire piston!
            self.Input("Fire!", 0, 1)
            self.total -= self.delay

        return plus.AI.Tick(self)

AI.register(SimpleWeapon)
