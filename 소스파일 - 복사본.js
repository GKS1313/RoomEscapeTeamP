Function.prototype.member = function(name, value){
	this.prototype[name] = value
}

//////// Game Definition
function Game(){}
Game.start = function(room, welcome){
	game.start(room.id)
	printMessage(welcome)
}
Game.end = function(){
	game.clear()
}
Game.move = function(room){
	game.move(room.id)	
}
Game.handItem = function(){
	return game.getHandItem()
}


//////// Room Definition

function Room(name, background){
	this.name = name
	this.background = background
	this.id = game.createRoom(name, background)
}
Room.member('setRoomLight', function(intensity){
	this.id.setRoomLight(intensity)
})

//////// Object Definition

function Object(room, name, image){
	this.room = room
	this.name = name
	this.image = image

	if (room !== undefined){
		this.id = room.id.createObject(name, image)
	}
}
Object.STATUS = { OPENED: 0, CLOSED: 1, LOCKED: 2 }

Object.member('setSprite', function(image){
	this.image = image
	this.id.setSprite(image)
})
Object.member('resize', function(width){
	this.id.setWidth(width)
})
Object.member('setDescription', function(description){
	this.id.setItemDescription(description)
})

Object.member('getX', function(){
	return this.id.getX()
})
Object.member('getY', function(){
	return this.id.getY()
})
Object.member('locate', function(x, y){
	this.room.id.locateObject(this.id, x, y)
})
Object.member('move', function(x, y){
	this.id.moveX(x)
	this.id.moveY(y)
})

Object.member('show', function(){
	this.id.show()
})
Object.member('hide', function(){
	this.id.hide()
})
Object.member('open', function(){
	this.id.open()
})
Object.member('close', function(){
	this.id.close()
})
Object.member('lock', function(){
	this.id.lock()
})
Object.member('unlock', function(){
	this.id.unlock()
})
Object.member('isOpened', function(){
	return this.id.isOpened()
})
Object.member('isClosed', function(){
	return this.id.isClosed()
})
Object.member('isLocked', function(){
	return this.id.isLocked()
})
Object.member('pick', function(){
	this.id.pick()
})
Object.member('isPicked', function(){
	return this.id.isPicked()
})

//////// Door Definition

function Door(room, name, closedImage, openedImage, connectedTo){
	Object.call(this, room, name, closedImage)

	// Door properties
	this.closedImage = closedImage
	this.openedImage = openedImage
	this.connectedTo = connectedTo
}
// inherited from Object
Door.prototype = new Object()

Door.member('onClick', function(){
	if (!this.id.isLocked() && this.id.isClosed()){
		this.id.open()
	}
	else if (this.id.isOpened()){
		if (this.connectedTo !== undefined){
			Game.move(this.connectedTo)
		}
		else {
			Game.end()
		}
	}
})
Door.member('onOpen', function(){
	this.id.setSprite(this.openedImage)
})
Door.member('onClose', function(){
	this.id.setSprite(this.closedImage)
})


//////// Keypad Definition

function Keypad(room, name, image, password, callback){
	Object.call(this, room, name, image)

	// Keypad properties
	this.password = password
	this.callback = callback
}
// inherited from Object
Keypad.prototype = new Object()

Keypad.member('onClick', function(){
	showKeypad('number', this.password, this.callback)
})


//////// DoorLock Definition
function DoorLock(room, name, image, password, door, message){
	Keypad.call(this, room, name, image, password, function(){
		printMessage(message)
		door.unlock()
	})
}
// inherited from Object
DoorLock.prototype = new Keypad()

/////// Item Definition

function Item(room, name, image){
	Object.call(this, room, name, image)
}
// inherited from Object
Item.prototype = new Object()

Item.member('onClick', function(){
	this.id.pick()
})


Item.member('isHanded', function(){
	return Game.handItem() == this.id
})

//이까지 재정의




room1 = new Room('room1', '배경-1.png')		// 변수명과 이름이 일치해야 한다.
room2 = new Room('room2', '배경-2.png')		// 변수명과 이름이 일치해야 한다.
room3 = new Room('room3', '배경-3.png')		// 변수명과 이름이 일치해야 한다.

room1.door1 = new Door(room1, 'door1', '문-오른쪽-닫힘.png', '문-오른쪽-열림.png', room2)
room1.door1.resize(120)
room1.door1.locate(1000, 312)
room1.door1.lock()

room1.key1 = new Item(room1, 'key1', '솜.png')
room1.key1.resize(45)
room1.key1.locate(745, 500)



//Item.member('onClick', function(){
//	this.id.pick()
//})

Item.member('onClick', function(){printMessage(this.name)})



goldfishcounter=0
room1.goldfish=new Item(room1, 'goldfish', '금붕어.png')
room1.goldfish.resize(200)
room1.goldfish.locate(100, 200)
room1.goldfish.onClick=function(){
	if(goldfishcounter==0)
	{
		printMessage("금붕어 설명")
		goldfishcounter++
	}
	else
	{
		room1.goldfish.pick()
		printMessage("금붕어 획득")
	}

}

milkpowdercounter=0
room1.milkpowder=new Item(room1, 'milkpowder', '애기.png')
room1.milkpowder.resize(200)
room1.milkpowder.locate(300, 500)
room1.milkpowder.onClick=function(){
	if(milkpowdercounter==0)
	{
		printMessage("분유통 설명")
		milkpowdercounter++
	}
	else
	{
		room1.milkpowder.pick()
		printMessage("분유통 획득")
	}

}

sojucounter=0
room1.soju=new Item(room1, 'soju', '소주병.png')
room1.soju.resize(200)
room1.soju.locate(400, 300)
room1.soju.onClick=function(){
	if(sojucounter==0)
	{
		printMessage("소주 설명")
		sojucounter++
	}
	else
	{
		room1.soju.pick()
		printMessage("소주 획득")
	}

}

envelopecounter=0
room1.envelope=new Item(room1, 'envelope', '돈.png')
room1.envelope.resize(200)
room1.envelope.locate(500, 200)
room1.envelope.onClick=function(){
	if(envelopecounter==0)
	{
		printMessage("돈봉투 설명")
		envelopecounter++
	}
	else
	{
		room1.envelope.pick()
		printMessage("돈봉투 획득")
	}

}

Item.member('onClick', function(Item){
	printMessage(Item.name)
})

//고정 객체
room1.cradle=new Item(room1, 'cradle', '요람.png')
room1.cradle.resize(200)
room1.cradle.locate(400, 200)
room1.cradle.close()
room1.cradle.onClick(room1.cradle)




room1.carpet=new Item(room1, 'carpet', '카페트.png')
room1.carpet.resize(200)
room1.carpet.locate(200, 300)
room1.carpet.close()
room1.carpet.onClick=function(){
	if(this.id.isClosed())
	{
		if(!Game.handItem())
		{
			printMessage(this.name)	
		}
		else
		{
			if(room1.envelope.isHanded())
			{
				this.id.open()
				printMessage("envelope")
		
			}
			else
			{
				printMessage("잘못 넣음 게임 종료")
		
			}
		}
	}
	else
	{
		printMessage("완료")
	}
}

room1.sofa=new Item(room1, 'sofa', 't1.png')
room1.sofa.resize(50)
room1.sofa.locate(300, 300)
room1.sofa.close()
room1.sofa.onClick=function(){

	if(this.id.isClosed())
	{
		if(!Game.handItem())
		{
			printMessage(this.name)	
		}
		else
		{
			if(room1.soju.isHanded())
			{
				this.id.open()
				printMessage("soju")
		
			}
			else
			{
				printMessage("잘못 넣음 게임 종료")
		
			}
		}
	}
	else
	{
		printMessage("완료")
	}
}

room1.fishbowl=new Item(room1, 'fishbowl', '어항.png')
room1.fishbowl.resize(200)
room1.fishbowl.locate(200, 200)
room1.fishbowl.close()
room1.fishbowl.onClick=function(){
	if(this.id.isClosed())
	{
		if(!Game.handItem())
		{
			printMessage(this.name)	
		}
		else
		{
			if(room1.fishbowl.isHanded())
			{
				this.id.open()
				printMessage("goldfish")
		
			}
			else
			{
				printMessage("잘못 넣음 게임 종료")
		
			}
		}
	}
	else
	{
		printMessage("완료")
	}
}

room1.door1.onClick = function(){

	if(room1.door1.isOpened()){
		Game.move(room2)
	}
	else if(room1.cradle.isOpened()&&room1.fishbowl.isOpened()&&room1.carpet.isOpened()&&room1.sofa.isOpened())
	{
		room1.door1.open()	
	}
	else if(room1.door1.isLocked())
	{
		printMessage("잠겨있음")		
	}
	
	

//	if (room1.key1.isHanded() && !this.id.isLocked() && this.id.isClosed()){
//		this.id.open()
//	}
//	else if (this.id.isOpened()){
//		if (this.connectedTo !== undefined){
//			Game.move(this.connectedTo)
//		}
//		else {
//			Game.end()
//		}
//	}
}


room2.door1 = new Door(room2, 'door1', '문-왼쪽-닫힘.png', '문-왼쪽-열림.png', room1)
room2.door1.resize(120)
room2.door1.locate(300, 270)

room2.door2 = new Door(room2, 'door2', '문-오른쪽-닫힘.png', '문-오른쪽-열림.png', room3)
room2.door2.resize(120)
room2.door2.locate(1000, 305)
room2.door2.hide()

room2.keypad1 = new Keypad(room2, 'keypad1', '숫자키-우.png', '1234', function(){
	printMessage('스르륵 문이 보인다')
	room2.door2.show()
})
room2.keypad1.resize(20)
room2.keypad1.locate(920, 250)

// onClick 함수를 재정의할 수도 있다
room2.keypad1.onClick = function(){
	printMessage('1234')
	showKeypad('number', this.password, this.callback)
}

room3.door1 = new Door(room3, 'door1', '문-왼쪽-닫힘.png', '문-왼쪽-열림.png', room2)
room3.door1.resize(120)
room3.door1.locate(300, 297)

room3.door2 = new Door(room3, 'door2', '문-오른쪽-닫힘.png', '문-오른쪽-열림.png')
room3.door2.resize(120)
room3.door2.locate(1000, 313)
room3.door2.lock()

room3.lock1 = new DoorLock(room3, 'lock1', '숫자키-우.png', '1234', room3.door2, '철커덕')
room3.lock1.resize(20)
room3.lock1.locate(920, 250)

Game.start(room1, '방탈출에 오신 것을 환영합니다!')
