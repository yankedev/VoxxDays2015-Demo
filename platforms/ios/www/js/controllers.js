function c(s){
	console.log(s);
}

angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope) {

})

.controller('SessionsCtrl', function($scope, $state, Api, $localstorage, SessionsSv, Utils) {
	var sessions = $localstorage.getObject('sessions');

	$scope.title = 'Sessions';
	$scope.doRefresh = function() {
		Api.get('/session/export').then(function(data){
			for(i in data){
				if(data[i].event_type)
					data[i].type = data[i].event_type.replace(/ /g,'');
			}
			c(data);
			$localstorage.setObject('sessions', data);
			$scope.sessions = data;
		})
		.finally(function(data) {
			// Stop the ion-refresher from spinning
			$scope.$broadcast('scroll.refreshComplete');
			$timeout(function() {
				Utils.hideL();
			}, 1500);

		});
	};

	$scope.go = function(type){
		c(type);
		if(type != undefined)
			$state.go('app.sessions_type', {type:type});
	}

	if(!sessions) {
		$scope.doRefresh();
	}

	$scope.sessions = sessions;

})

.controller('SessionCtrl', function($scope, $stateParams, SessionsSv, Utils, Speakers) {
	var id = $stateParams.id;
	Utils.showL();

	var d = SessionsSv.get(id);


    d.event_start = new Date(d.event_start).toISOString();
	d.event_end= new Date(d.event_end).toISOString();

	if( d.speakers ){
		d.speaker = Speakers.get( d.speakers[0].name );
		d.sp_name = d.speakers[0].name.replace(/ /g,'');
	}
	$scope.d = d;
    Utils.hideL();


})

.controller('TypeCtrl', function($scope, Api, $localstorage, SessionsSv, Utils, $stateParams) {
	var type = $stateParams.type;
	$scope.title = type;
	$scope.sessions = SessionsSv.getByType(type);
})

.controller('SpeakersCtrl', function($scope, Speakers) {
	var speakers = Speakers.fetch();
	for(i in speakers){
		speakers[i].sp_name = speakers[i].name.replace(/ /g,'')
	}
	$scope.speakers = speakers;
	c($scope.speakers);
})

.controller('SpeakerCtrl', function($scope, $stateParams, SessionsSv, Utils, Speakers) {
	var name = $stateParams.name;
	var sp = Speakers.get(name);
	c(sp);
	sp.sessions = SessionsSv.getBySpeaker(sp.username);
	$scope.d = sp;
	c($scope.d);
});
