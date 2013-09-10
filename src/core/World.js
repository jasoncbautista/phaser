Phaser.World = function (game) {

	this.game = game;

	this.bounds = new Phaser.Rectangle(0, 0, game.width, game.height);

	this.camera = null;

	this.currentRenderOrderID = 0;
	
};

Phaser.World.prototype = {


	boot: function () {

		this.camera = new Phaser.Camera(this.game, 0, 0, 0, this.game.width, this.game.height);
		this.game.camera = this.camera;

	},

	add: function (gameobject) {

		this.game.stage._stage.addChild(gameobject);
		return gameobject;

	},

	addAt: function (gameobject, index) {

		this.game.stage._stage.addChildAt(gameobject, index);
		return gameobject;

	},

	getAt: function (index) {

		return this.game.stage._stage.getChildAt(index);

	},

	remove: function (gameobject) {

		this.game.stage._stage.removeChild(gameobject);
		return gameobject;

	},

	update: function () {

		this.camera.update();

		this.currentRenderOrderID = 0;

		if (this.game.stage._stage.first._iNext)
		{
			var currentNode = this.game.stage._stage.first._iNext;
			
			do	
			{
				if (currentNode['preUpdate'])
				{
					currentNode.preUpdate();
				}

				if (currentNode['update'])
				{
					currentNode.update();
				}
				
				currentNode = currentNode._iNext;
			}
			while (currentNode != this.game.stage._stage.last._iNext)
		}

	},

	/**
	* Updates the size of this world.
	*
	* @param width {number} New width of the world.
	* @param height {number} New height of the world.
	*/
	setSize: function (width, height) {

		this.bounds.width = width;
		this.bounds.height = height;

	},

	bringToTop: function (child) {

		this.remove(child);
		this.add(child);

		return child;

	},

	swapChildren: function (child1, child2) {

		if (child1 === child2 || !child1.parent || !child2.parent)
		{
			console.warn('You cannot swap a child with itself or swap un-parented children');
			return false;
		}

		//	Cache the values
		var child1Prev = child1._iPrev;
		var child1Next = child1._iNext;
		var child2Prev = child2._iPrev;
		var child2Next = child2._iNext;

		var endNode = this.game.stage._stage.last._iNext;
		var currentNode = this.game.stage._stage.first;
			
		do	
		{
			if (currentNode !== child1 && currentNode !== child2)
			{
				if (currentNode.first === child1)
				{
					currentNode.first = child2;
				}
				else if (currentNode.first === child2)
				{
					currentNode.first = child1;
				}

				if (currentNode.last === child1)
				{
					currentNode.last = child2;
				}
				else if (currentNode.last === child2)
				{
					currentNode.last = child1;
				}
			}

			currentNode = currentNode._iNext;
		}
		while (currentNode != endNode)

		if (child1._iNext == child2)
		{
			//	This is a downward (A to B) neighbour swap
			child1._iNext = child2Next;
			child1._iPrev = child2;
			child2._iNext = child1;
			child2._iPrev = child1Prev;

			if (child1Prev) { child1Prev._iNext = child2; }
			if (child2Next) { child2Next._iPrev = child1; }

			if (child1.__renderGroup)
			{
				child1.__renderGroup.updateTexture(child1);
			}

			if (child2.__renderGroup)
			{
				child2.__renderGroup.updateTexture(child2);
			}

			return true;
		}
		else if (child2._iNext == child1)
		{
			//	This is an upward (B to A) neighbour swap
			child1._iNext = child2;
			child1._iPrev = child2Prev;
			child2._iNext = child1Next;
			child2._iPrev = child1;

			if (child2Prev) { child2Prev._iNext = child1; }
			if (child1Next) { child2Next._iPrev = child2; }

			if (child1.__renderGroup)
			{
				child1.__renderGroup.updateTexture(child1);
			}

			if (child2.__renderGroup)
			{
				child2.__renderGroup.updateTexture(child2);
			}

			return true;
		}
		else
		{
			//	Children are far apart
			child1._iNext = child2Next;
			child1._iPrev = child2Prev;
			child2._iNext = child1Next;
			child2._iPrev = child1Prev;

			if (child1Prev) { child1Prev._iNext = child2; }
			if (child1Next) { child1Next._iPrev = child2; }
			if (child2Prev) { child2Prev._iNext = child1; }
			if (child2Next) { child2Next._iPrev = child1; }

			if (child1.__renderGroup)
			{
				child1.__renderGroup.updateTexture(child1);
			}

			if (child2.__renderGroup)
			{
				child2.__renderGroup.updateTexture(child2);
			}

			return true;
		}

		return false;
		
	}

};

//	Getters / Setters

Object.defineProperty(Phaser.World.prototype, "width", {

    get: function () {
        return this.bounds.width;
    },

    set: function (value) {
        this.bounds.width = value;
    },

    enumerable: true,
    configurable: true
});

Object.defineProperty(Phaser.World.prototype, "height", {

    get: function () {
        return this.bounds.height;
    },

    set: function (value) {
        this.bounds.height = value;
    },

    enumerable: true,
    configurable: true
});

Object.defineProperty(Phaser.World.prototype, "centerX", {

    get: function () {
        return this.bounds.halfWidth;
    },

    enumerable: true,
    configurable: true
});

Object.defineProperty(Phaser.World.prototype, "centerY", {

    get: function () {
        return this.bounds.halfHeight;
    },

    enumerable: true,
    configurable: true
});

Object.defineProperty(Phaser.World.prototype, "randomX", {

    get: function () {
        return Math.round(Math.random() * this.bounds.width);
    },

    enumerable: true,
    configurable: true
});

Object.defineProperty(Phaser.World.prototype, "randomY", {

    get: function () {
        return Math.round(Math.random() * this.bounds.height);
    },

    enumerable: true,
    configurable: true
});
