/* Note Service: Handles "Note" game mode functionality */
app.service('NameNoteService', function(NoteModel, GameControlService){
	
	/****************************************
	 *				 VARIABLES		    	*
	 ****************************************/

	var _noteNameList = ["C", "Cs", "Db", "D", "Ds", "Eb", "E", "F", "Fs", "Gb", "G", "Gs", "Ab", "A", "As", "B", "Bb"];
	var clefUsed = "";
	var keyUsed = "";
	var _correctAnswerIndex = "";
	
	/****************************************
	 *			COMMON FUNCTIONS		   	*
	 ****************************************/

	//Get a random question.
	this.getQuestion = function(){
		var randomIndex = Math.floor(Math.random() * _noteNameList.length);
		var noteName = _noteNameList[randomIndex];
		var choosenNote = NoteModel.getNoteWithName(noteName);

		//Choose Clef
		clefUsed = GameControlService.getClefUsed();
		var choosenNoteArray = "";
		if(clefUsed == "G"){
			choosenNoteArray = choosenNote.CoorY.G;
		}
		else
			choosenNoteArray = choosenNote.CoorY.F;
		
		//Get key signature.
		var randomKeyIndex = Math.floor(Math.random() * choosenNote.Key.length);
		keyUsed = choosenNote.Key[randomKeyIndex];

		//Get note coordination.
		var x = '50';
		var randomNoteIndex = Math.floor(Math.random() * choosenNoteArray.length);
		var y = choosenNoteArray[randomNoteIndex];
		var note = "<note x=" + x + " y=" + y + " acc='none'></note>";

		//Set correct answer
		_correctAnswerIndex = randomIndex;
		GameControlService.setCorrectAnswer(noteName);
		return note;
	}

	//Return key signature used for this question.
	this.getKey = function(){
		var key = "<key value=" + keyUsed + " clef=" + clefUsed + " ></key>";
		return key;
	}

	//Construct a random answer set.
	this.getAnswerSet = function(){
		var resultSet = [];

		//Get 3 wrong answers
		for(i = 1; i <= 3; i++){
			var currentNoteIndex = (_correctAnswerIndex + 2 * i) % _noteNameList.length;
			var currentNoteName = _noteNameList[currentNoteIndex];
			var currentNote = "<answer value=" + currentNoteName + " type='Note'></answer>";
			resultSet.push(currentNote);
		}

		//Add correct answer
		var correctAnswer = _noteNameList[_correctAnswerIndex];
		var cAnswer = "<answer value=" + correctAnswer + " type='Note'></answer>";
		var randomInsertIndex = Math.floor(Math.random() * 4);
		resultSet.splice(randomInsertIndex, 0, cAnswer);

		return resultSet;

	}
});