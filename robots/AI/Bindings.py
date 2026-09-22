import math

def load(list):
    print "Loading AI bindings"

    # binding format:
    # ( 'name of robot from .bot file', 'name of AI from script class',
    #       {'optional constructor parameter':value, 'another':value} )

    # constructor parameters:
    # nose - "front" of bot in radians (default 0)
    # invertible - can function upside-down (default False)
    # topspeed - speed in meters/second AI will attempt not to exceed (default 4.0)
    # throttle - maximum analog value AI will attempt not to exceed (default 100)
    # turnspeed - turning in radians/second AI will attempt not to exceed (default 2.5)
    # turn - maximum analog value AI will attempt not to exceed (default 60)
    # radius - bot radius to use for checking for hazards and walls (default 1.0)

# Team15: Sgt Stone
    list.append( ("flipMODE", "Flipper", { 'invertible': True, 'topspeed' : 12.0, 'throttle' : 140, 'turnspeed': 2.0, 'weapons': (9,) }) )
    list.append( ("Pneumenace", "Poker", { 'topspeed': 12.0, 'throttle': 110, 'turn':80, 'turnspeed':1.5, 'weapons': (13,) }) )
    list.append( ("Detonator", "Flipper", { 'radius':1.4, 'topspeed' : 12.0, 'throttle' : 110, 'weapons': (11, 12) }) )
    list.append( ("Fang The Mantis", "Chopper", { 'radius':1.4, 'topspeed' : 12.0, 'turnspeed': 1.0, 'weapons': (8, 10) }) )
    list.append( ("Saturday Night Slammer", "Flipper", { 'weapons': (14,) }) )
    list.append( ("Wooden Warrior IV", "Chopper", { 'invertible': True, 'radius':1.4, 'weapons': (9, 10, 11, 12) }) )

# Team16: Alien Research Team
    list.append( ("It Came From The Moon", "Rammer", { 'turnspeed' : 1.0 }) )
    list.append( ("Thwacktar", "Whipper", { 'invertible': True, 'topspeed' : 12.0, 'throttle' : 110, 'turnspeed' : 1.5, 'weapons': (9, 10) }) )
    list.append( ("The Truth", "Chopper", { 'radius':1.4, 'topspeed' : 12.0, 'turnspeed': 1.0, 'weapons': (8,) }) )
    list.append( ("This Planet Sucks!", "Rammer", { 'topspeed': 190.0, 'turnspeed': 150.0, 'throttle': 110, 'weapons': (21, 22) }) )
    list.append( ("The... Probe", "Poker", { 'radius':1.4, 'topspeed' : 130.0, 'throttle' : 130, 'weapons': (9,) }) )
    list.append( ("Mothership", "Spinner", { 'radius':1.4, 'weapons': (9, 11) }) )

# Team17: United Commoners
    list.append( ("5 Gallon Bucket", "Rammer", { 'topspeed' : 8.0, 'turnspeed' : 1.75 }) )
    list.append( ("Chop Shop", "Chopper", { 'radius': 1.4, 'topspeed' : 7.0, 'throttle' : 110, 'weapons' : (10,) }) )
    list.append( ("Final Verdict", "Chopper", { 'radius':1.4, 'topspeed' : 9.0, 'throttle': 110, 'turnspeed': 1.0, 'weapons': (13,) }) )
    list.append( ("Cement Mixer", "Spinner", { 'weapons': (21, 22) }) )
    list.append( ("Padre Diablo", "Chopper", { 'radius': 1.4, 'topspeed' : 7.0, 'throttle' : 110, 'weapons' : (10,) }) )
    list.append( ("Harry The Potter", "Spinner", { 'invertible': True, 'weapons': (21, 22) }) )

# Team18: Lethal Dosage
    list.append( ("Face Scruncher", "Spinner", { 'invertible': True, 'turnspeed' : 1.0, 'topspeed' : 12.0, 'throttle' : 120, 'weapons': (7, 8) }) )
    list.append( ("4000 Rads", "Chopper", { 'invertible': True, 'topspeed' : 12.0 , 'turnspeed' : 1.5 , 'throttle' : 120, 'weapons': (15, 10) }) )
    list.append( ("The Big 1", "Rammer", { 'radius': 1.5, 'invertible': True, 'turnspeed' : 1.0 }) )
    list.append( ("Item", "Spinner", { 'topspeed': 200.0, 'turnspeed': 150.0, 'throttle': 200, 'weapons': (21, 22) }) )
    list.append( ("ShockWave", "Spinner", { 'topspeed': 120.0, 'throttle': 110, 'weapons': (21, 22) }) )
    list.append( ("Aftermath", "Spinner", { 'topspeed': 120.0, 'turnspeed': 150.0, 'throttle': 150, 'weapons': (21, 22) }) )

# Team19: The Disturbed Ones
    list.append( ("Cheap Shot", "Spinner", { 'invertible': True, 'radius':1.2, 'turnspeed' : 1.15, 'topspeed' : 12, 'throttle' : 120, 'weapons': (6,) }) )
    list.append( ("Cheese", "Pusher", { 'invertible': True, 'radius' : 1.3, 'turn' : 5 }) )
    list.append( ("Monkey Wrench", "Spinner", { 'topspeed': 12.0, 'turnspeed': 2.0, 'throttle': 110, 'weapons': (21, 22, 23, 24) }) )
    list.append( ("Spikey", "Poker", { 'topspeed' : 14.0, 'throttle' : 150, 'turnspeed': 2.0, 'weapons': (1, 2, 3) }) )
    list.append( ("Chewbot", "DirectionalSpinner", { 'topspeed': 12.0, 'throttle': 110, 'turn':80, 'turnspeed':1.8, 'weapons': (1, 2, 3 ) }) )
    list.append( ("Tank", "Rammer", { 'nose' : math.pi, 'throttle' : 50, 'topspeed' : 10.0, 'turnspeed' : 0.2, 'turn':50 }) )

# Team20: United States Army
    list.append( ("Wire Cutter", "Chopper", { 'invertible': True, 'topspeed' : 12.0 , 'turnspeed' : 1.25 , 'throttle' : 130, 'weapons': (11,) }) )
    list.append( ("Bomb Disposal Unit 32", "Poker", { 'invertible': True, 'topspeed' : 12.0, 'throttle' : 125, 'turnspeed' : 1.5, 'weapons': (15,) }) )
    list.append( ("M1A1", "Flipper", { 'radius':1.5, 'topspeed': 12.0, 'turn': 20, 'weapons': (29, 30) }) )
    list.append( ("Claymore", "Rammer", { 'weapons': (9, 10) }) )
    list.append( ("4 X 4", "Chopper", { 'nose': math.pi, 'invertible': True, 'radius':1.1, 'turnspeed' : 1.0, 'turn' : 20.0, 'topspeed' : 12.0, 'throttle' : 120, 'weapons': (9, 10) }) )
    list.append( ("M2A2", "Spinner", { 'weapons': (21, 22) }) )

# Team21: Pyros
    list.append( ("Fire Burst", "Rammer", { 'invertible': True, 'topspeed' : 12.0, 'throttle' : 120 }) )
    list.append( ("Satan's Forklift", "Flipper", { 'invertible': True, 'turnspeed' : 0.8, 'topspeed' : 12, 'weapons': (13, 14) }) )
    list.append( ("Bomb", "Whipper", { 'turnspeed' : 1.0, 'topspeed' : 12.0, 'weapons': (8, 12, 14, 15) }) )
    list.append( ("Spark", "Spinner", { 'invertible': True, 'weapons': (21, 22) }) )
    list.append( ("Fire Storm", "Pusher", { 'invertible': True, 'radius': 1.5, }) )
    list.append( ("Mind Meld", "Spinner", { 'weapons': (21, 22) }) )

# Team22: Reptilian Team
    list.append( ("Pit Viper", "Chopper", { 'topspeed' : 12.0 , 'turnspeed' : 1.75 , 'throttle' : 120, 'weapons': (12, 14) }) )
    list.append( ("Predator", "Chopper", { 'invertible': True, 'radius':1.2, 'topspeed' : 12 , 'throttle' : 110, 'turnspeed': 1.0, 'weapons': (13, 16) }) )
    list.append( ("Garden Dragon", "Pusher", { 'radius':1.5, 'turnspeed' : 1.5 }) )
    list.append( ("Snatcher", "Rammer", { 'invertible': True, 'weapons': (21, 22) }) )
    list.append( ("Snapping Turtle", "Flipper", { 'radius':1.4, 'weapons': (21, 22)}) )
    list.append( ("Alpha Dragon", "Pusher", { 'radius':1.5, 'weapons': (29, 30) }) )

# Team23: Stoners
    list.append( ("Get High", "Flipper", { 'topspeed' : 12, 'throttle' : 120, 'weapons': (10,) }) )
    list.append( ("Tokin' It", "Flipper", { 'topspeed' : 9, 'throttle' : 115, 'turn':80, 'weapons': (16,) }) )
    list.append( ("Ultra Bong", "Poker", { 'invertible': True, 'radius':1.2, 'turnspeed' : 1.0, 'topspeed' : 12.0, 'throttle' : 110, 'weapons': (18, 19) }) )
    list.append( ("Bad Trip", "Spinner", { 'weapons': (21, ) }) )
    list.append( ("Weed Cutter", "Chopper", { 'radius':1.1, 'throttle' : 120, 'weapons': (9,) }) )
    list.append( ("The Munchies", "Pusher", { 'radius':1.5, }) )

# Team24: Mode II
    list.append( ("Ghetto Blaster", "Chopper", { 'radius':1.1, 'topspeed' : 12.0 , 'turnspeed' : 2.0 , 'throttle' : 120, 'weapons': (8,) }) )
    list.append( ("Traffic Jam", "Rammer", { 'radius':1.2, 'turnspeed' : 1.0, 'topspeed' : 12.0, 'throttle' : 120 }) )
    list.append( ("Overwhelming Force", "Flipper", { 'topspeed' : 12.0, 'weapons': (15, 16) }) )
    list.append( ("Diamondback", "Pusher", { }) )
    list.append( ("Rift Blade", "Spinner", { 'weapons': (21, 22, 23) }) )
    list.append( ("Loch", "Spinner", { 'weapons': (21, 22, 23, 3), 'invertible': True, }) )

# Team25: The Robo Zone
    list.append( ("Tilt A Whirl", "Spinner", { 'topspeed' : 10.0, 'throttle' : 110.0, 'weapons': (8, 9, 10) }) )
    list.append( ("Crap Bot 3000", "Rammer", { 'turnspeed' : 1.25 }) )
    list.append( ("Stomper", "Rammer", { 'invertible': True, 'turnspeed' : 1.5, 'topspeed' : 12.0 }) )
    list.append( ("Lemon-Lime", "Poker", { 'radius':1.4, 'weapons': (9,) }) )
    list.append( ("Twist N Shout", "Spinner", { 'radius':1.4, 'weapons': (9, 10) }) )
    list.append( ("Irrational Exuberance", "Spinner", { 'radius':1.4, 'weapons': (9, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12) }) )

# Team26: Brute Force
    list.append( ("RC Car", "Rammer", { 'turnspeed': 1.5 }) )
    list.append( ("Underdawg", "Pusher", { 'turnspeed' : 2.0 }) )
    list.append( ("Mega Force 2", "Pusher", { 'radius': 1.4, 'topspeed':4.0, 'turnspeed' : 3.5 }) )
    list.append( ("No Escape", "Pusher", { 'turnspeed': 1.5, 'invertible': True }) )
    list.append( ("All Your Bot Are Belong To Us", "Rammer", { 'radius':1.4, }) )
    list.append( ("Prize Grab Machine", "Chopper", { 'radius':1.4, 'weapons': (9, 10, 11) }) )

# Team27: Under Pressure
    list.append( ("Big Box Bot", "Rammer", { 'invertible': True, 'turnspeed' : 1.75 }) )
    list.append( ("Invertigo", "Spinner", { 'invertible': True, 'turnspeed' : 1.25, 'topspeed' : 12.0, 'throttle' : 110, 'weapons': (4, 1) }) )
    list.append( ("Pressure", "Chopper", { 'radius': 1.3, 'topspeed' : 12 , 'throttle' : 110 , 'turnspeed' : 1.25, 'weapons': (14, 15) }) )
    list.append( ("Mini Klamp", "Chopper", { 'invertible': True, 'radius':1.4, 'weapons': (9,) }) )
    list.append( ("Class Act", "Spinner", { 'weapons': (4, 1, 2, 3), 'invertible': True }) )
    list.append( ("Thumperizer III", "Chopper", { 'weapons': (21, 22, 23, 24) }) )

# Team28: Chaos
    list.append( ("Deceptitron", "Poker", { 'invertible': True, 'radius':1.1, 'turnspeed' : 1.0, 'turn' : 20.0, 'topspeed' : 12.0, 'throttle' : 120, 'weapons': (9,) }) )
    list.append( ("The Chaos Engine 2", "Spinner", { 'invertible': True, 'radius':1.2, 'topspeed' : 12.0, 'throttle': 120, 'turnspeed' : 1.75, 'weapons': (16, 17, 19, 23) }) )
    list.append( ("Tryke", "Chopper", { 'topspeed' : 10.0, 'weapons': (7,) }) )
    list.append( ("Psygnos", "Spinner", { 'invertible': True, 'weapons': (21, 22, 1) }) )
    list.append( ("Stratosphere", "Spinner", { 'weapons': (21, 22) }) )
    list.append( ("Northern Fury", "Spinner", { 'weapons': (21, 22) }) )

# Team29: Computer Hackers
    list.append( ("PIN", "Whipper", { 'invertible': True, 'turnspeed':1.5, 'turn':80, 'topspeed':12.0, 'throttle': 110, 'weapons':(14,) }) )
    list.append( ("Circuit Breaker Mk III", "Spinner", { 'topspeed' : 12.0, 'throttle' : 110, 'turnspeed': 1.5, 'weapons': (25,) }) )
    list.append( ("LAN Mower", "Spinner", { 'topspeed' : 12.0, 'throttle' : 115, 'turnspeed': 2.0, 'weapons': (16, 17 ) }) )
    list.append( ("HAX0R", "Rammer", { 'radius': 1.4, 'topspeed' : 7.0, 'throttle' : 110, }) )
    list.append( ("Bit Rot", "Rammer", { 'invertible': True, 'topspeed': 400.0, 'throttle': 150, 'weapons': (21, 22) }) )
    list.append( ("Firewall", "Rammer", { 'invertible': True, 'topspeed': 120.0, 'throttle': 110, 'weapons': (21, 22, 23, 24, 1, 2) }) )

# Team30: Pokemon Robotics
    list.append( ("Psychic Spinner", "Spinner", { 'topspeed': 12.0, 'throttle': 110, 'turn':80, 'turnspeed':1.5, 'weapons': (13, 11) }) )
    list.append( ("Earthquake!!!", "Spinner", { 'turnspeed':1.5, 'turn':80, 'topspeed':12.0, 'throttle': 110, 'weapons':(14,) }) )
    list.append( ("Tha Master", "Flipper", { 'topspeed' : 9, 'throttle' : 115, 'turn':80, 'weapons': (16,) }) )
    list.append( ("Quick Attack", "Rammer", { 'invertible': True, 'topspeed' : 11.0, 'throttle' : 110, 'turnspeed': 1.0, 'weapons': (16, 17 ) }) )
    list.append( ("Dive Bomb", "Pusher", { 'invertible': True, 'radius':1.4, 'topspeed' : 9.0, 'throttle': 110, 'turnspeed': 1.0 }) )
    list.append( ("King Krabby", "Flipper", { 'topspeed' : 10.0, 'throttle' : 110.0, 'weapons': (8,) }) )

# Team31: Powerhouse Two
    list.append( ("Lightning Rod", "Chopper", { 'radius': 1.4, 'topspeed':4.0, 'turnspeed' : 3.5, 'weapons':(14,) }) )
    list.append( ("X L R 8", "Pusher", { 'invertible': True, 'radius':1.2, 'turnspeed' : 1.15, 'topspeed' : 12, 'throttle' : 120, 'weapons': (6,) }) )
    list.append( ("Atomic Generator", "Spinner", { 'invertible': True, 'topspeed' : 12.0 , 'turnspeed' : 1.5 , 'throttle' : 120, 'weapons': (15, 10, 12, 1) }) )
    list.append( ("Unit56", "Spinner", { 'topspeed' : 8.0, 'turnspeed' : 1.75, 'weapons':(14,), 'invertible': True }) )
    list.append( ("F.L.A.S.H.", "Rammer", { 'invertible': True, 'turnspeed' : 1.75, 'weapons':(14, 1, 2, 3) }) )
    list.append( ("p0werh0use tw0", "Flipper", { 'topspeed': 12.0, 'turnspeed': 2.0, 'throttle': 110, 'weapons': (21,) }) )

# Team32: Aquas
    list.append( ("Harpoon", "Poker", { 'invertible': True, 'turnspeed' : 2.0, 'weapons': (21,) }) )
    list.append( ("Watermill", "Spinner", { 'topspeed' : 10.0, 'weapons': (7, 1, 2, 3, 4, 5, 6, 8) }) )
    list.append( ("Turbine", "Spinner", { 'invertible': True, 'turnspeed' : 1.0, 'topspeed' : 12, 'weapons': (13, 14, 15, 16) }) )
    list.append( ("Sand Dune", "Pusher", { 'invertible': True, 'radius' : 1.3, 'turn' : 5 }) )
    list.append( ("Starfish", "Poker", { 'invertible': True, 'radius':1.5, 'topspeed': 12.0, 'turn': 20, 'weapons': (29, 30, 1) }) )
    list.append( ("Tidal Wave", "Flipper", { 'turnspeed' : 1.5, 'topspeed' : 12.0, 'weapons': (21,) }) )

# Team33: Team Plastic Fruit
    list.append( ("Laser Gates", "Rammer", { 'radius':1.1, 'topspeed' : 12.0 , 'turnspeed' : 2.0 , 'throttle' : 120, 'weapons': (8, 12) }) )
    list.append( ("Razor Burn", "Chopper", { 'topspeed' : 12, 'throttle' : 120, 'weapons': (10, 1) }) )
    list.append( ("Worm Hole", "Spinner", { 'radius':1.4, 'topspeed' : 12.0, 'turnspeed': 1.0, 'weapons': (8, 4, 1, 2), 'invertible': True }) )
    list.append( ("Decibal", "Spinner", { 'topspeed' : 12.0, 'weapons': (15,) }) )
    list.append( ("Stop", "Spinner", { 'invertible': True, 'radius':1.2, 'topspeed' : 12 , 'throttle' : 110, 'turnspeed': 1.0, 'weapons': (13,) }) )
    list.append( ("Facefull Of Steel", "Rammer", { 'invertible': True, 'topspeed' : 12.0 , 'turnspeed' : 1.25 , 'throttle' : 130, 'weapons': (11, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14) }) )

# Team34: Sinister Squad
    list.append( ("Stretcher", "Rammer", { 'invertible': True, 'turnspeed': 1.5, 'weapons': (12, 1) }) )
    list.append( ("Quarter", "Chopper", { 'invertible': True, 'turnspeed' : 1.0, 'topspeed' : 12.0, 'weapons': (8, 12, 14, 15) }) )
    list.append( ("The Rack", "Spinner", { 'radius':1.2, 'turnspeed' : 1.0, 'topspeed' : 12.0, 'throttle' : 12, 'weapons': (12, 1, 2, 3, 4, 5) }) )
    list.append( ("Laceration", "Whipper", { 'invertible': True, 'topspeed' : 12.0, 'throttle' : 120, 'weapons': (12, 1, 2, 3) }) )
    list.append( ("Silence", "Flipper", { 'invertible': True, 'topspeed' : 12.0 , 'turnspeed' : 1.75 , 'throttle' : 120, 'weapons': (12,) }) )
    list.append( ("Sticks & Stones", "Spinner", { 'radius': 1.4, 'topspeed' : 7.0, 'throttle' : 110, 'weapons' : (10, 1, 2, 3, 4, 5) }) )

# Team35: New Island Technologies
    list.append( ("Infernus", "Pusher", { 'invertible': True, 'turnspeed' : 1.0, 'topspeed' : 12.0, 'throttle' : 120 }) )
    list.append( ("0115D8CF", "Pusher", { 'invertible': True, 'radius': 1.3, 'topspeed' : 12 , 'throttle' : 110 , 'turnspeed' : 1.25 }) )
    list.append( ("Chainsaw Charlie", "Spinner", { 'turnspeed' : 1.25, 'weapons' : (10, 1, 2, 3, 4, 5) }) )
    list.append( ("Stealth", "Chopper", { 'turnspeed' : 1.25, 'topspeed' : 12.0, 'throttle' : 110, 'weapons': (4, ) }) )
    list.append( ("Streamliner", "Flipper", { 'topspeed' : 12.0, 'throttle' : 110, 'turnspeed': 1.5, 'weapons': (25,) }) )
    list.append( ("Bumper", "Poker", { 'weapons': (25,), 'turnspeed' : 1.0 }) )

# Team36: Inventive Minds
    list.append( ("Phase IV", "Pusher", { 'radius': 1.5, 'turnspeed' : 1.0 }) )
    list.append( ("Hate Factory", "Spinner", { 'topspeed' : 12.0, 'throttle' : 110, 'turnspeed' : 1.5, 'weapons': (9, 10, 1) }) )
    list.append( ("Stomperama III", "Chopper", { 'topspeed' : 12.0, 'throttle' : 140, 'turnspeed': 2.0, 'weapons': (9,) }) )
    list.append( ("Plink", "Poker", { 'invertible': True, 'radius':1.4, 'topspeed' : 12.0, 'throttle' : 110, 'weapons': (11,) }) )
    list.append( ("Fox Trot", "Spinner", { 'radius':1.5, 'turnspeed' : 1.5, 'weapons': (11, 1, 2, 3, 4, 5) }) )
    list.append( ("Centrifuge Of Pain", "Poker", { 'radius':1.1, 'turnspeed' : 1.0, 'turn' : 20.0, 'topspeed' : 12.0, 'throttle' : 120, 'weapons': (9, 1, 2, 3) }) )

# Team37: X-Force
    list.append( ("Dragon Spawn", "Spinner", { 'topspeed' : 12.0, 'throttle' : 125, 'turnspeed' : 1.5, 'weapons': (15,) }) )
    list.append( ("Telekinesis", "Poker", { 'radius':1.2, 'topspeed' : 12.0, 'throttle': 120, 'turnspeed' : 1.75, 'weapons': (16,) }) )
    list.append( ("The Dragoness", "Flipper", { 'invertible': True, 'radius':1.2, 'turnspeed' : 1.0, 'topspeed' : 12.0, 'throttle' : 110, 'weapons': (18,) }) )
    list.append( ("Veloci-Riptor", "Spinner", { 'invertible': True, 'weapons': (14,) }) )
    list.append( ("PinDragon", "Chopper", { 'topspeed': 120.0, 'throttle': 110, 'weapons': (21, 22) }) )
    list.append( ("V", "Spinner", { 'radius':1.5, 'weapons': (21, 22) }) )

# Team38: United States Navy
    list.append( ("Quadrant", "Pusher", { 'topspeed': 400.0, 'throttle': 150 }) )
    list.append( ("CODE: RED", "Spinner", { 'radius':1.4, 'weapons': (9, 1, 2, 3) }) )
    list.append( ("Defcon 1", "Rammer", { 'radius':1.4, 'weapons': (9, 10, 11, 1, 2, 3, 4, 5) }) )
    list.append( ("Level 5", "Spinner", { 'topspeed' : 14.0, 'throttle' : 150, 'turnspeed': 2.0, 'weapons': (1, 2, 3, 4, 5, 6) }) )
    list.append( ("Turbulance", "Flipper", { 'topspeed': 200.0, 'turnspeed': 150.0, 'throttle': 200, 'weapons': (21,) }) )
    list.append( ("Striker II", "Chopper", { 'weapons': (21, 22) }) )

# Team39: Revenge of teh Noobs
    list.append( ("OMG WTF SUSPENDED", "Whipper", { 'invertible': True, 'weapons': (21, 22, 23, 24) }) )
    list.append( ("!11!one!1eleven!", "Flipper", { 'throttle' : 50, 'topspeed' : 10.0, 'turnspeed' : 0.2, 'turn':50, 'weapons': (21, 22, 23, 24) }) )
    list.append( ("OMG WTF BANNED", "Pusher", { }) )
    list.append( ("1337", "Pusher", { 'invertible': True, 'radius':1.4, }) )
    list.append( ("Obvious ICED OUT Clone", "Flipper", { 'weapons': (21, 22) }) )
    list.append( ("7h3 d347h 5p1nn3r", "Spinner", { 'radius': 1.5, 'weapons': (9, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13) }) )

# Team40: People in the Basement
    list.append( ("Lurker", "Flipper", { 'invertible': True, 'topspeed': 12.0, 'throttle': 110, 'turn':80, 'turnspeed':1.8, 'weapons': (1, 2,) }) )
    list.append( ("Student Driver", "Rammer", { 'car': True, 'invertible': True, 'weapons': (21, 22) }) )
    list.append( ("Fully Articulated Plow", "Flipper", { 'car': True, 'invertible': True, 'radius':1.4, 'weapons': (9, 1,) }) )
    list.append( ("Any Time Is Good For Pizza!!", "Spinner", { 'invertible': True, 'weapons': (9, 1, 2, 3) }) )
    list.append( ("Drum Ba Dum Dum", "Spinner", { 'weapons': (21, 1, 2, 3, 4,) }) )
    list.append( ("Smack In The Box", "Spinner", { 'radius':1.4, 'weapons': (9, 11) }) )

# Team41: Maximum Resistance
    list.append( ("1K", "Spinner", { 'weapons': (21, 22,) }) )
    list.append( ("Octa-GONE", "Spinner", { 'radius':1.4, 'weapons': (21, 22, 1)}) )
    list.append( ("Big Red", "Spinner", { 'weapons': (9, 10, 1, 2, 3, 4, 5, 6) }) )
    list.append( ("Solar Flare", "Rammer", { 'turnspeed': 1.5, 'weapons': (9,), 'invertible': True }) )
    list.append( ("Short Phuse", "Spinner", { 'invertible': True, 'weapons': (21, 22) }) )
    list.append( ("F-7", "Spinner", { 'weapons': (21, 22, 23, 1) }) )

# Team42: Toxic
    list.append( ("17", "Pusher", { 'invertible': True, 'weapons': (21, 22) }) )
    list.append( ("ChemTox", "Spinner", { 'weapons': (21, 22) }) )
    list.append( ("Heavy Lobster", "Chopper", { 'radius': 1.4, 'topspeed' : 7.0, 'throttle' : 110, 'weapons' : (10, 11) }) )
    list.append( ("Fissure", "Flipper", { 'topspeed': 120.0, 'throttle': 110, 'weapons': (21, 22) }) )
    list.append( ("toXic", "Pusher", { 'radius':1.4, 'weapons': (9,) }) )
    list.append( ("Experiment X", "Spinner", { 'invertible': True, 'radius':1.4, 'weapons': (9, 10, 1, 2, 3, 4) }) )

# Team43: Destruction 101
    list.append( ("101", "Rammer", { 'weapons': (4, 1), 'invertible': True }) )
    list.append( ("Fork Truck", "Poker", { 'invertible': True, 'radius': 1.4, 'topspeed' : 7.0, 'throttle' : 110, 'weapons': (9,) }) )
    list.append( ("The Windcallers", "Spinner", { 'topspeed': 190.0, 'turnspeed': 150.0, 'throttle': 110, 'weapons': (21, 22, 1, 2) }) )
    list.append( ("Paradox Twilight", "Spinner", { 'nose': math.pi, 'topspeed': 120.0, 'turnspeed': 150.0, 'throttle': 150, 'weapons': (21, 22) }) )
    list.append( ("Shades Of Green", "Flipper", { 'radius':1.4, 'topspeed' : 130.0, 'throttle' : 130, 'weapons': (9,) }) )
    list.append( ("WHAT? WHERE?", "Chopper", { 'radius':1.4, 'topspeed' : 12.0, 'turnspeed': 1.0, 'weapons': (8, 10) }) )

# Team44: Radio F Software
    list.append( ("Keep BACK 500 Ft.", "Chopper", { 'radius':1.4, 'weapons': (9, ) }) )
    list.append( ("Digital Dragon 2", "Spinner", { 'invertible': True, 'radius':1.5, 'weapons': (29, 30, 1) }) )
    list.append( ("Tha Thumperizer", "Spinner", { 'invertible': True, 'weapons': (21, 22, 1, 2, 3, 4) }) )
    list.append( ("LaunchPad", "Flipper", { 'radius':1.1, 'turnspeed' : 1.0, 'turn' : 20.0, 'topspeed' : 12.0, 'throttle' : 120, 'weapons': (9, ) }) )
    list.append( ("404", "Spinner", { 'invertible': True, 'weapons': (21, 22, 1, 2) }) )
    list.append( ("Wooden Warrior", "Spinner", { 'radius':1.1, 'throttle' : 120, 'weapons': (9, 1) }) )

# Team0: RA1 Revenge
    list.append( ("The Patriot Act", "Chopper", { 'radius':1.0, 'weapons': (1, 2) }) )
    list.append( ("Going Commando", "Rammer", { 'invertible': True, 'radius':1.0, 'throttle':120.0, 'topspeed': 12.0, 'weapons': (1, ) }) )
    list.append( ("Executioner EX", "Chopper", { 'radius':1.0, 'weapons': (1, 2, 3, 4, 5, 6) }) )
    list.append( ("Menace 2 Society", "Poker", { 'radius':1.0, 'weapons': (1, 2) }) )
    list.append( ("Gammarazer", "Spinner", { 'invertible': True, 'radius':1.0, 'weapons': (1, 2, 3, 4) }) )
    list.append( ("Wimpy 2K10", "Spinner", { 'radius':1.0, 'weapons': (1, 2, 3, 4) }) )

# Team1: RA2 Revamped
    list.append( ("Holy Moly", "Rammer", { 'invertible': True, 'radius':1.0, 'topspeed': 120.0, 'weapons': (1, 2, 3, 4) }) )
    list.append( ("Close Shave", "Chopper", { 'radius':1.0, 'weapons': (1, 2, 3, 4) }) )
    list.append( ("Uncare Bear", "Spinner", { 'radius':1.0, 'weapons': (1, 2, 3, 4, 5, 6, 7, 8) }) )
    list.append( ("Sam R. Rye", "Whipper", { 'radius':1.0, 'turnspeed': 3.0, 'weapons': (1, 2, 3, 4) }) )
    list.append( ("Best Served Cold", "Spinner", { 'radius':1.0, 'weapons': (1, 2) }) )
    list.append( ("The 'Merge", "Flipper", { 'radius':1.0, 'topspeed': 140.0, 'turnspeed': 2.0, 'weapons': (1, 2) }) )

# Team2: RFS' Greatest Hits
    list.append( ("LaunchPad 2", "Flipper", { 'radius':1.0, 'topspeed': 140.0, 'turnspeed': 2.0, 'weapons': (1, ) }) )
    list.append( ("HACK!", "Spinner", { 'invertible': True, 'radius':1.0, 'weapons': (1, 2, 3, 4) }) )
    list.append( ("Balls Of Steel Revolution", "Spinner", { 'invertible': True, 'radius':1.0, 'weapons': (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14) }) )
    list.append( ("No Escape Reincarnated", "Chopper", { 'radius':1.0, 'weapons': (1, ) }) )
    list.append( ("CrapBot: The Reckoning", "Spinner", { 'radius':1.0, 'weapons': (1, 2, 3, 4, 5, 6, 7, 8) }) )
    list.append( ("SUPER Thumperizer", "Spinner", { 'invertible': True, 'radius':1.0, 'weapons': (1, 2, 3, 4, 5, 6) }) )

# Team3: Firepower 2000
    list.append( ("Toasty", "Poker", { 'radius':1.0, 'weapons': (1, 2, 3) }) )
    list.append( ("The Maw", "Rammer", { 'radius':1.0, 'topspeed': 100.0, 'weapons': (1, 2, 3, 4, 5, 6, 7, 8) }) )
    list.append( ("Rammunition", "Rammer", { 'invertible': True, 'radius':1.0, 'weapons': (1, 2, 3) }) )
    list.append( ("Runaway Rocket", "Poker", { 'radius':1.0, 'weapons': (1, ) }) )
    list.append( ("Cutthroat", "Spinner", { 'invertible': True, 'radius':1.0, 'weapons': (1, ) }) )
    list.append( ("Mad Max", "Poker", { 'radius':1.0, 'weapons': (1, 2, 3, 4, 5, 6, 7) }) )

# Team4: Second Chance Team
    list.append( ("Draconic 2004", "Pusher", { 'radius':1.0, 'weapons': (1, 2) }) )
    list.append( ("The Bloody Butcher", "Chopper", { 'radius':1.0, 'weapons': (1, 2) }) )
    list.append( ("Steamroller", "Spinner", { 'radius':1.0, 'weapons': (1, 2, 3, 4, 5, 6, 7, 8) }) )
    list.append( ("Green Machine", "Flipper", { 'radius':1.0, 'topspeed': 100.0, 'weapons': (1, ) }) )
    list.append( ("Screwed", "Spinner", { 'radius':1.0, 'weapons': (1, 2, 3, 4, 5, 6, 7) }) )
    list.append( ("Blood Dumpster", "Spinner", { 'radius':1.0, 'weapons': (1, 2) }) )

# Team5: The Blast Works
    list.append( ("H-Bomb", "Chopper", { 'radius':1.0, 'weapons': (1, ) }) )
    list.append( ("The Distracting Machine", "Flipper", { 'radius':1.0, 'weapons': (1, ) }) )
    list.append( ("Auto-Axe", "Spinner", { 'radius':1.0, 'weapons': (1, 2, 3, 4) }) )
    list.append( ("Swingline", "Rammer", { 'radius':1.0, 'topspeed': 250.0, 'weapons': (1, ) }) )
    list.append( ("Renegade Quattro", "Rammer", { 'invertible': True, 'radius':1.0, 'topspeed': 150.0, 'weapons': (1, 2, 4, 5, 6, 7, 8, 9) }) )
    list.append( ("Moon Trekker", "Chopper", { 'radius':1.0, 'weapons': (1, 2, 3, 4) }) )

# Team6: Spare Partz
    list.append( ("Vamp", "Poker", { 'radius':1.0, 'weapons': (1, 2) }) )
    list.append( ("Creep", "Chopper", { 'invertible': True, 'radius':1.0, 'weapons': (1, 2) }) )
    list.append( ("Hot Pursuit", "Spinner", { 'radius':1.0, 'topspeed': 140.0, 'weapons': (1, 2) }) )
    list.append( ("Blade Runner", "Rammer", { 'invertible': True, 'radius':1.0, 'weapons': (1, 2, 3, 4) }) )
    list.append( ("Excelsior Stretch", "Poker", { 'invertible': True, 'radius':1.0, 'weapons': (1, 2) }) )
    list.append( ("The Fursecutioner", "Spinner", { 'radius':1.0, 'weapons': (1, 2, 3, 4) }) )

# Team7: Atari Age
    list.append( ("CX2601", "Rammer", { 'radius':1.0, 'topspeed': 125.0, 'weapons': (1, 2, 3, 4, 5) }) )
    list.append( ("Prototype 3", "Spinner", { 'radius':1.0, 'weapons': (1, ) }) )
    list.append( ("Heavy Sixer", "Chopper", { 'radius':1.0, 'weapons': (1, 2) }) )
    list.append( ("Dragonslayer", "Rammer", { 'radius':1.0, 'topspeed': 130.0, 'weapons': (1, 2, 3) }) )
    list.append( ("Shredder '77", "Spinner", { 'nose': math.pi, 'radius':1.0, 'weapons': (1, 2, 3, 4, 5, 6) }) )
    list.append( ("Desert Burial", "Spinner", { 'radius':1.0, 'weapons': (1, ) }) )

# Team8: Robotic Ruiners
    list.append( ("Roller Wrecker", "Spinner", { 'invertible': True, 'radius':1.0, 'weapons': (1, ) }) )
    list.append( ("Mousetrap", "Chopper", { 'radius':1.0, 'turnspeed': 120.0, 'weapons': (1, 2) }) )
    list.append( ("Heavy Scrapper", "Chopper", { 'radius':1.0, 'weapons': (1, 2, 3, 4, 5) }) )
    list.append( ("Rocker", "Spinner", { 'invertible': True, 'radius':1.0, 'weapons': (1, 2) }) )
    list.append( ("Harmony Bunny", "Spinner", { 'invertible': True, 'radius':1.0, 'weapons': (1, 2, 3, 4) }) )
    list.append( ("Killdozer", "Pusher", { 'radius':1.0, 'weapons': (1, ) }) )

# Team9: Team MegaSparkRiotStorm
    list.append( ("Jeremy Clarkson", "Chopper", { 'radius':1.0, 'weapons': (1, ) }) )
    list.append( ("The Legend of Bryce Genesis", "Pusher", { 'radius':1.0, 'topspeed': 150.0, 'weapons': (1, ) }) )
    list.append( ("Killer Car Wash", "Pusher", { 'radius':1.0, 'weapons': (1, 2, 3, 4, 5, 6, 7) }) )
    list.append( ("Not SMEE", "Pusher", { 'invertible': True, 'radius':1.0, 'weapons': (1, ) }) )
    list.append( ("Mall Ninja", "Chopper", { 'radius':1.0, 'weapons': (1, 2, 3, 4) }) )
    list.append( ("Wheel of Misfortune", "Spinner", { 'invertible': True, 'radius':1.0, 'weapons': (1, 2) }) )

# Team10: The Sparksters
    list.append( ("Sparkster", "Spinner", { 'radius':1.0, 'weapons': (1, ) }) )
    list.append( ("Snappy", "Chopper", { 'radius':1.0, 'weapons': (1, 2, 3, 4, 5, 6) }) )
    list.append( ("Move This", "Rammer", { 'radius':1.0, 'topspeed': 200.0, 'turnspeed': 200.0, 'weapons': (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12) }) )
    list.append( ("Da Claw", "Flipper", { 'radius':1.0, 'weapons': (1, ) }) )
    list.append( ("JULAY", "Poker", { 'radius':1.0, 'weapons': (1, ) }) )
    list.append( ("Fandango", "Spinner", { 'radius':1.0, 'weapons': (1, 2, 3, 4) }) )

# Team11: Retro Bits
    list.append( ("Assault Rig", "Pusher", { 'radius':1.0, 'topspeed': 120.0, 'weapons': (1, ) }) )
    list.append( ("Kuribo Kicker", "Chopper", { 'radius':1.0, 'weapons': (1, ) }) )
    list.append( ("Red Warrior", "Chopper", { 'radius':1.0, 'turnspeed': 1.0, 'weapons': (1, ) }) )
    list.append( ("Pac Bot", "Chopper", { 'radius':1.0, 'weapons': (1, 2) }) )
    list.append( ("Number 000", "Spinner", { 'radius':1.0, 'turnspeed': 5.0, 'weapons': (1, 2, 3, 4) }) )
    list.append( ("STryKer", "Spinner", { 'invertible': True, 'radius':1.0, 'weapons': (1, 2, 3) }) )

# Team12: Battle Clash Legends
    list.append( ("Inferno", "Rammer", { 'invertible': True, 'topspeed':120.0, 'radius':1.0, 'weapons': (1, 2, 3, 4, 5, 6) }) )
    list.append( ("MIST", "Rammer", { 'invertible': True, 'topspeed':120.0, 'radius':1.0, 'weapons': (1, 2, 3, 4) }) )
    list.append( ("Terminal Impact", "Spinner", { 'radius':1.0, 'weapons': (1, 2) }) )
    list.append( ("Pannel", "Pusher", { 'radius':1.0, 'weapons': (1, ) }) )
    list.append( ("PokeBot", "Flipper", { 'radius':1.0, 'weapons': (1, ) }) )
    list.append( ("Metalhead 2", "Spinner", { 'radius':1.0, 'weapons': (1, 2) }) )

# Team13: BattleBots Update
    list.append( ("Bravado", "Flipper", { 'radius':1.0, 'weapons': (1, ) }) )
    list.append( ("Siren", "Flipper", { 'invertible': True, 'radius':1.0, 'weapons': (1, 2) }) )
    list.append( ("A Terrible Twin", "Spinner", { 'invertible': True, 'radius':1.0, 'turnspeed': 5.0, 'weapons': (1, 2, 3, 4) }) )
    list.append( ("Sexy Matilda", "Chopper", { 'radius':1.0, 'weapons': (1, 2) }) )
    list.append( ("Astatine 5", "Spinner", { 'invertible': True, 'radius':1.0, 'weapons': (1, ) }) )
    list.append( ("Sabertooth Cat", "Spinner", { 'radius':1.0, 'weapons': (1, 2, 3, 4) }) )

# Team14: Too Much Head
    list.append( ("Weed Whacker", "Spinner", { 'invertible': True, 'radius':1.0, 'weapons': (1, 2, 3, 4) }) )
    list.append( ("M.C. Speschel", "Spinner", { 'radius':1.0, 'weapons': (1, 2) }) )
    list.append( ("Burritos", "Chopper", { 'invertible': True, 'radius':1.0, 'weapons': (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15) }) )
    list.append( ("Pecker", "Poker", { 'radius':1.0, 'weapons': (1, ) }) )
    list.append( ("Worst Pet", "Chopper", { 'radius':1.0, 'weapons': (1, 2, 3, 4) }) )
    list.append( ("Gravitron", "Spinner", { 'radius':1.0, 'weapons': (1, 2, 3, 4) }) )