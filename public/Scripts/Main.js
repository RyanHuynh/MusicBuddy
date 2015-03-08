var app = angular.module('myApp', ['ngDialog']);

/****************************************
 *			 MAIN CONTROLLER 		   	*
 ****************************************/
app.controller('mainCtrl', function($window, $scope,$compile, ngDialog, NameNoteService, ChordService, ScaleService, GameControlService, SettingService){
	$scope.nextQuestionSwitch = false;
	var _currentCategory = '';
	var _loopTimeout; 

	//Check Answer respond and render respond to UI.
	$scope.checkRespond = function(){
		var respond = GameControlService.getQuestionRespond();
		var respondBox = angular.element(document.querySelector("div[id='respondBox']"));
		respondBox.append($compile(respond)($scope));

		//Display next question box.
		setTimeout(function(){
			$scope.nextQuestionSwitch = true;
			$scope.$apply();
		}, 1000);

		//Disable all answer buttons.
		angular.element(document.querySelector("div[id='answerBox']")).children().off('click');

		//Show notes, extra line (if game mode is easr training)
		if(SettingService.isEarTraining()){
			var extraLine = document.getElementsByClassName('extraline');
			for(var i = 0; i < extraLine.length; i++)
				extraLine[i].style.visibility = 'visible';
			var noteDisplay = document.getElementsByTagName('note');
			for(var i = 0; i < noteDisplay.length; i++)
				noteDisplay[i].style.visibility = 'visible';
		}
	}

	//Routine run for "Note" game mode.
	var NameNoteRun = function(){
		var questionBox = angular.element(document.querySelector('div[id=questionBox]'));

		//Get key signature used.
		var key = GameControlService.getKeyUsed();
		questionBox.append($compile(key)($scope));

		//Get question .
		var note = NameNoteService.getQuestion();
		questionBox.append($compile(note)($scope));

		//Get answers for the question.
		var answerSet = NameNoteService.getAnswerSet();
		var answerBox = angular.element(document.querySelector('div[id=answerBox]'));
		answerBox.children().remove();
		for(i = 0; i < answerSet.length; i++){
			var answer = answerSet[i];
			answerBox.append(answer);
		}
		$compile(answerBox)($scope);
	};

	//Routine run for "Chord" game mode.
	var ChordRun = function(){
		var questionBox = angular.element(document.querySelector('div[id=questionBox]'));
		
		//Get key signature used.
		var key = GameControlService.getKeyUsed();
		questionBox.append($compile(key)($scope));

		//Get question
		var notes = ChordService.getQuestion();
		for(i =0; i < notes.length; i++){
			var note = notes[i];
			questionBox.append($compile(note)($scope));
		}

		//Get answers for the question.
		var answerSet = ChordService.getAnswerSet();
		var answerBox = angular.element(document.querySelector('div[id=answerBox]'));
		answerBox.children().remove();
		
		for(i = 0; i < answerSet.length; i++){
			var answer = answerSet[i];
			answerBox.append(answer);
		}
		$compile(answerBox)($scope);
	};

	//Routine run for "Chord" game mode.
	var ScaleRun = function(){
		var questionBox = angular.element(document.querySelector('div[id=questionBox]'));
		
		//Get question
		var notes = ScaleService.getQuestion();
		for(i =0; i < notes.length; i++){
			var note = notes[i];
			questionBox.append($compile(note)($scope));
		}

		//Get answers for the question.
		var answerSet = ScaleService.getAnswerSet();
		var answerBox = angular.element(document.querySelector('div[id=answerBox]'));
		answerBox.children().remove();
		
		for(i = 0; i < answerSet.length; i++){
			var answer = answerSet[i];
			answerBox.append(answer);
		}
		$compile(answerBox)($scope);
	};

	//Construct new question.
	$scope.nextQuestion = function(){
		$scope.nextQuestionSwitch  = false;

		//Clear out the question box.
		var questionBox = angular.element(document.querySelector('div[id=questionBox]'));
		questionBox.children().remove();
		
		//Pick a question type base on choice in setting.
		var questionType = SettingService.getQuestionType();
		_currentCategory = questionType[Math.floor(Math.random() * questionType.length)];

		//Reset game state and start new one.
		GameControlService.gameStart(_currentCategory);

		//Get clef used.
		var clefUsed = GameControlService.getClefUsed();
		questionBox.css('background-image', 'url(Resources/Img/Clef/' + clefUsed + '.jpg)' );

		//Pick a question for question type.
		if(_currentCategory == "Note")
			NameNoteRun();
		else if(_currentCategory == "Chord")
			ChordRun();
		else
			ScaleRun();

		//Get sound source for note (Ear Training mode).
		if(SettingService.isEarTraining()){
			var musicBox = angular.element(document.querySelector('div[id=musicBox]'));
			musicBox.children().remove();
			musicBox.append(GameControlService.getSoundSource());
			var repeatBtn = document.getElementById('repeatBtn');
			repeatBtn.style.visibility = 'visible';

			//Hide notes, extra line.
			var extraLine = document.getElementsByClassName('extraline');
			for(var i = 0; i < extraLine.length; i++)
				extraLine[i].style.visibility = 'hidden';
			var noteDisplay = document.getElementsByTagName('note');
			for(var i = 0; i < noteDisplay.length; i++)
				noteDisplay[i].style.visibility = 'hidden';
			setTimeout($scope.playSound, 500);
		}
		else{
			//Clear repeat btn
			var repeatBtn = document.getElementById('repeatBtn');
			repeatBtn.style.visibility = 'hidden';
		}

		//Add question text.
		questionBox.append(GameControlService.getQuestionText(_currentCategory));
	};

	//Play music notes.
	$scope.playSound = function(){
		var currentNoteIndex = 0;
		if(_loopTimeout){
			clearTimeout(_loopTimeout);
			currentNoteIndex = 0;
		}
		
		var musicCtrl = document.getElementsByClassName('audioElement');
		if(_currentCategory == 'Chord' && SettingService.isBlockChord())
			var noteDelay = 0;
		else
			var noteDelay = 500;
		var playLoop = function(){
			musicCtrl[currentNoteIndex].play();
			currentNoteIndex++;
			if(currentNoteIndex != musicCtrl.length)
			_loopTimeout = setTimeout(playLoop, noteDelay);
		}
		playLoop();
	}

	//Open setting menu.
	$scope.openSetting = function(){
		ngDialog.open({
			template : 'Views/setting.html',
			className: 'ngdialog-theme-default setting-layout'});
	}

	//Recompile size when orientation change.
	angular.element($window).bind('orientationchange', function(){
		var answerBox = angular.element(document.querySelector('div[id=answerBox]'));
		var questionBox = angular.element(document.querySelector('div[id=questionBox]'));
		$compile(answerBox)($scope);
		$compile(questionBox)($scope);
	});

	//Listen for setting change.
	$scope.$on('settingApplied', function(){
		ngDialog.close();
		$scope.nextQuestion();
	});

	//Open feedback tab.
	$scope.openFeedback = function(){
		ngDialog.open({
			template : 'Views/feedback.html',
			className: 'ngdialog-theme-default feedback',
			controller: 'feedbackCtrl'});
	}
	//First run.
	$scope.nextQuestion();
});
app.controller('feedbackCtrl', function($http,$scope){
	$scope.submitFeedback = function(){
		$http.post('/api/feedback/MusicBuddy', $scope.Feedback)
			.success(function(res){
				
			});
		$scope.closeThisDialog();
	};
});
app.controller('settingCtrl', function($rootScope, $scope, SettingService){
	//Load setting.
	//Question type.
	$scope.noteType = SettingService.isNoteType();
	$scope.chordType = SettingService.isChordType();
	$scope.scaleType = SettingService.isScaleType();

	//Chord Setting
	$scope.inversionChord = SettingService.isChordInverted();
	$scope.chordWithKey = SettingService.isKeyUsedinChord();
	$scope.blockChord = SettingService.isBlockChord();

	//Scale Setting
	$scope.randomNotePos = SettingService.isRandomNotePos();

	//Game mode.
	$scope.earTraining = SettingService.isEarTraining();

	//Apply setting
	$scope.applySetting = function(){
		SettingService.saveQuestionType($scope.noteType, $scope.chordType, $scope.scaleType);
		SettingService.saveGameMode($scope.earTraining);
		SettingService.saveChordSetting($scope.inversionChord,$scope.chordWithKey,$scope.blockChord);
		SettingService.saveScaleSetting($scope.randomNotePos);
		$rootScope.$broadcast('settingApplied');
	};

	//Reset to default
	$scope.defaultSetting = function(){
		$scope.noteType = true;
		$scope.chordType = true;
		$scope.scaleType = true;

		$scope.earTraining = false;

		$scope.inversionChord = false;
		$scope.chordWithKey = false;
		$scope.blockChord = false;

		$scope.randomNotePos = false;
	};
});
/****************************************
 *		  UI ELEMENT DIRECTIVES 	   	*
 ****************************************/
app.directive('note', function(GameControlService){
	return{
		scope: {
			x : '@',
			y : '@',
			acc : '@', 
			accPos : '@'
		},
		template: "<accidental type='{{ acc }}' position='{{ accPos }}'></accidental>",
		link : function(scope, element){
			//Pick a random node
			var noteDuration = GameControlService.getNoteDuration();
			element.css('background-image', noteDuration);
			element.css('left', scope.x + '%');
			element.css('top', scope.y + '%');

			//Add extra line if needed.
			GameControlService.addExtraLine(scope.x, scope.y);
		}
	}
});	
app.directive('accidental', function(){
	return {
		scope : {
			type : '@',
			position: '@'
		},
		link : function(scope, element){
			element.css('background-image', 'url(Resources/Img/Accidental/' + scope.type + '.png)');
			element.css('left', scope.position * (-10) + "px");
		}
	}
})

app.directive('answer', function(GameControlService){
	return {
		link : function(scope, element, attrs){
			element.css('background-image', 'url(Resources/Img/Answer/' + attrs.type + "/" + attrs.value + '.png)');
			element.bind('click', function(){
				GameControlService.isCorrectAnswer(attrs.value);	
				scope.checkRespond();
				element.addClass('animated rotateOutDownLeft')
			});	
		}
	}
})
app.directive('respond', function($window){
	return {
		scope: {
			type : '@'
		},
		controller: function($scope){
			var randomRespondIndex = Math.floor(Math.random() * 4 + 1);
			if($scope.type == "R"){
				$scope.bkground = 'url(Resources/Img/Respond/Correct/' + randomRespondIndex + '.png)';
			}
			else
				$scope.bkground = 'url(Resources/Img/Respond/Wrong/' + randomRespondIndex + '.png)';
		},
		template : '{{ display }}',
		link : function(scope, element){
			element.css('background-image', scope.bkground);
			element.addClass('bounceIn');
		}
	}
});
app.directive('key', function(){
	return {
		scope : {
			value : '@',
			clef : '@'
		},
		link: function(scope, element){
			if(scope.clef == "F")
				element.css('top', '5%');
			element.css('background-image', 'url(Resources/Img/Key/' + scope.value + '.png)');
		}
	}
});

/****************************************
 *		   CSS CLASS DIRECTIVES	 	  	*
 ****************************************/

 //This class to make sure question has a fixed size ratio.
app.directive('questionBoxSize',function($compile){
	return {
		restrict: 'C',
		link : function(scope, element, attrs){
			var elemWidth = element[0].offsetWidth;
			var elemHeight = elemWidth / 2.3;
			element.css("height", elemHeight + 'px');
		}
	}
});

app.directive('squareBox', function($window){
    return { 
        restrict: 'C',
        link: function(scope, element){
            var style = $window.getComputedStyle(element[0], null);
            var width = style.getPropertyValue('width');
            element.css('height', width);
        }
    }
});


