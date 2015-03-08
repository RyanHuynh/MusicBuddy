app.service('SettingService', function(){
	//Question type.
	var _questionType = ["Note","Chord","Scale"];
	// var _questionType = ["Note"];
	var _noteType = true;
	var _chordType = true;
	var _scaleType = true;

	//Game mode
	var _earTraining = false;

	//Chord setting default value.
	var _inversionChord = false;
	var _keyUsedInChord = false;
	var _blockChord = false;

	//Scale setting with default value.
	var _randomNotePos = false;

	this.saveQuestionType = function(noteType, chordType, scaleType){
		_noteType = noteType;
		_chordType = chordType;
		_scaleType = scaleType;

		_questionType = [];		
		if(noteType == true)
			_questionType.push("Note");
		if(chordType == true)
			_questionType.push("Chord");
		if(scaleType == true)
			_questionType.push("Scale");
		if(_questionType.length == 0){
			_questionType.push("Note");
			_noteType = true;
		}
	}
	this.saveGameMode = function(earTraining){
		_earTraining = earTraining;
	}
	this.saveChordSetting = function(inversion, keyUsed, chordType){
		_inversionChord = inversion;
		_keyUsedInChord = keyUsed;
		_blockChord = chordType;
	}
	this.saveScaleSetting = function(randomPos){
		_randomNotePos = randomPos;
	}

	//Question type.
	this.isNoteType = function(){
		return _noteType;
	}
	this.isChordType = function(){
		return _chordType;
	}
	this.isScaleType = function(){
		return _scaleType;
	}
	this.getQuestionType = function(){
		return _questionType;
	}

	//Game Mode.
	this.isEarTraining = function(){
		return _earTraining;
	}

	//Chord Setting.
	this.isChordInverted = function(){
		return _inversionChord;
	}
	this.isKeyUsedinChord = function(){
		return _keyUsedInChord;
	}
	this.isBlockChord = function(){
		return _blockChord;
	}

	//Scale Setting.
	this.isRandomNotePos = function(){
		return _randomNotePos;
	}
});