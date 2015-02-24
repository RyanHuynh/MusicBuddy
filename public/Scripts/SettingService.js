app.service('SettingService', function(){
	//Question type.
	var _questionType = ["Note","Chord","Scale"];
	// var _questionType = ["Chord"];
	var _noteType = true;
	var _chordType = true;
	var _scaleType = true;

	//Chord setting default value.
	var _inversionChord = false;
	var _keyUsedInChord = false;

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
	this.saveChordSetting = function(inversion, keyUsed){
		_inversionChord = inversion;
		_keyUsedInChord = keyUsed;
	}
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

	//Chord setting.
	this.isChordInverted = function(){
		return _inversionChord;
	}
	this.isKeyUsedinChord = function(){
		return _keyUsedInChord;
	}
});