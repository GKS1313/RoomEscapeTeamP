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

function Door(room, name, closedImage, openedImage, connectedTo, width, x, y){
	Object.call(this, room, name, closedImage)

	// Door properties
	this.closedImage = closedImage
	this.openedImage = openedImage
	this.connectedTo = connectedTo

	this.resize(width)
	this.locate(x, y)
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

function Item(room, name, image, width, x, y){
	Object.call(this, room, name, image)
	this.resize(width)
	this.locate(x, y)
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

room1.door1 = new Door(room1, 'door1', '문-오른쪽-닫힘.png', '문-오른쪽-열림.png', room2, 120, 1000, 312)
//room1.door1.resize(120)
//room1.door1.locate(1000, 312)
room1.door1.lock()



//Item.member('onClick', function(){
//	this.id.pick()
//})

Item.member('onClick', function(){
//	printMessage(this.name)
})

//방1 배경소품
room1.table=new Item(room1, 'table', '1큰상.png', 1000, 700, 500)
room1.aircon=new Item(room1, 'aircon', '1에어컨.png', 300, 150, 100)
room1.tv=new Item(room1, 'tv', '1TV.png', 200, 300, 200)
room1.carpet=new Item(room1, 'carpet', '1카페트.png', 500, 600, 600)
room1.fdoor=new Item(room1, 'fdoor', '1현관문.png', 200, 100, 400)
room1.fdoor.onClick=function()
{
	printMessage("밖에 못 나감")
}

room1.window=new Item(room1, 'window', '1창문.png', 200, 800, 200) 
memcounter=0
room1.mem=new Item(room1, 'mem', '책.png', 50, 650, 500)
room1.mem.onClick=function()
{
	if(memcounter==0)
	{
		memcounter++
		playSound("브롤스타즈 BGM - 메인화면.wav")
	}
	room1.memo.show()			
}

//고정 객체

room1.carpetshawdow=new Item(room1, 'carpetshawdow', '카페트아래.png', 200, 600, 600)
room1.carpetshawdow.close()
room1.carpetshawdow.onClick=function(){
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
				printMessage("비상금은 항상 아무도 모르게 챙겨두자…")
		
			}
			else if(room1.milkpowder.isHanded())
			{
				//playSound("애기우는소리.wav")
				//game.setGameoverMessage("애기 울림")

				//game.gameover()
		
				printMessage(room1.milkpowder.name+"잘못 넣음 게임 종료")
		
			}
			else if(room1.goldfish.isHanded())
			{
				//game.setGameoverMessage("졌다! 오늘 저녁은 피쉬앤그릴이다!")
				//game.gameover()
		
				printMessage(room1.goldfish.name+"잘못 넣음 게임 종료")
		
			}
			else if(room1.soju.isHanded())
			{

				//game.setGameoverMessage("애기 : 아빠 이따 밤에 엄마 몰래 한잔 기기?")
				//game.gameover()

				printMessage(room1.soju.name+"잘못 넣음 게임 종료")
			}
		}
	}
	else
	{
		printMessage("완료")
	}
}

room1.cradle=new Item(room1, 'cradle', '1요람.png', 200, 50, 600)
room1.cradle.close()
room1.cradle.onClick=function(){
	if(this.id.isClosed())//close 상태일 때
	{
		if(!Game.handItem())//아무것도 안 가지고 있을 때
		{
			printMessage(this.name)	
		}
		else
		{
			if(room1.milkpowder.isHanded())
			{
				this.id.open()
				printMessage("애기 서울대 가라고 서울우유만 사는건 오바아닌가;;")
		
			}
			else if(room1.envelope.isHanded())
			{
				//game.setGameoverMessage(msg)
				//playYoutube("https://www.youtube.com/watch?v=PVcpF7J2oXs")
				//game.gameover()
				printMessage(room1.envelope.name+"잘못 넣음 게임 종료")
		
			}
			else if(room1.goldfish.isHanded())
			{
				//game.setGameoverMessage("졌다! 오늘 저녁은 피쉬앤그릴이다!")
				//game.gameover()
				printMessage(room1.goldfish.name+"잘못 넣음 게임 종료")
				
		
			}
			else if(room1.soju.isHanded())
			{	
				//game.setGameoverMessage("애기 : 아빠 이따 밤에 엄마 몰래 한잔 기기?")
				//game.gameover()
				printMessage(room1.soju.name+"잘못 넣음 게임 종료")
			}
		}
	}
	else//open 상태
	{
		printMessage("완료")
	}
}



room1.sofa=new Item(room1, 'sofa', '1쇼파.png', 200, 1000, 700)
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
				printMessage("이따 마눌님 주무시면 혼술 조져야지 히히")
		
			}
			else if(room1.milkpowder.isHanded())
			{
				//playSound("애기우는소리.wav")
				//game.gameover()

				printMessage(room1.milkpowder.name+"잘못 넣음 게임 종료")
		
			}
			else if(room1.goldfish.isHanded())
			{
				//game.setGameoverMessage("졌다! 오늘 저녁은 피쉬앤그릴이다!")
				//game.gameover()

				printMessage(room1.goldfish.name+"잘못 넣음 게임 종료")
		
			}
			else if(room1.envelope.isHanded())
			{
				//game.setGameoverMessage("동작 그만! 밑장 빼기냐!")

				//game.gameover()

				printMessage(room1.envelope.name+"잘못 넣음 게임 종료")
			}
		}
	}
	else
	{
		printMessage("완료")
	}
}

room1.fishbowl=new Item(room1, 'fishbowl', '1어항.png', 200, 300, 600)
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
			if(room1.goldfish.isHanded())
			{
				this.id.open()
				printMessage("goldfish")
		
			}
			else if(room1.milkpowder.isHanded())
			{
				//playSound("애기우는소리.wav")
				//game.setGameoverMessage("애기 울림")


				//game.gameover()

				printMessage(room1.milkpowder.name+"잘못 넣음 게임 종료")
		
			}
			else if(room1.soju.isHanded())
			{
				//game.setGameoverMessage("애기 : 아빠 이따 밤에 엄마 몰래 한잔 기기?")
				//game.gameover()

				printMessage(room1.soju.name+"잘못 넣음 게임 종료")
		
			}
			else if(room1.envelope.isHanded())
			{
				//game.setGameoverMessage("동작 그만! 밑장 빼기냐!")

				//game.gameover()

				printMessage(room1.envelope.name+"잘못 넣음 게임 종료")
			}

		}
	}
	else
	{
		printMessage("완료")
	}
}

//방1 사용 아이템

goldfishcounter=0
room1.goldfish=new Item(room1, 'goldfish', '1금붕어.png', 200, 900, 500)
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
room1.milkpowder=new Item(room1, 'milkpowder', '1우유.png', 200, 300, 500)
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
room1.soju=new Item(room1, 'soju', '1소주병.png', 200, 400, 500)
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
room1.envelope=new Item(room1, 'envelope', '1돈.png', 200, 500, 450)
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




room1.door1.onClick = function(){

	if(room1.door1.isOpened()){
		Game.move(room2)
	}
	else if(room1.cradle.isOpened()&&room1.fishbowl.isOpened()&&room1.carpetshadow.isOpened()&&room1.sofa.isOpened())
	{
		room1.door1.open()	
	}
	else if(room1.door1.isLocked())
	{
		printMessage("잠겨있음")		
	}
}

room1.memo=new Item(room1, 'memo', '쪽지내용.png', 700, 600, 400)
room1.memo.hide()
room1.memo.onClick=function()
{
	room1.memo.hide()
	printMessage("연애할 때에는 분명 이러지 않았었는데…밥차려준게 어디냐. 하 일단 청소부터 해볼까..")	
}


//방 2 시작
room2.door1 = new Door(room2, 'door1', '문-왼쪽-닫힘.png', '문-왼쪽-열림.png', room1, 120, 200, 312)
room2.door1.open()
//room2.door1.onClick=function()
//{
//	game.move(room1)	
//}
room2.door2 = new Door(room2, 'door2', '문-오른쪽-닫힘.png', '문-오른쪽-열림.png', room3, 120, 1000, 312)


//방 3 시작

Game.start(room1, '평화로운 주말….어제 회식 때문에 너무 머리가 아프다… 엇 저기 아침밥상이 있군 아이조아')
