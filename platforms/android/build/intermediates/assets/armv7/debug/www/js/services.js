angular.module('starter.services', [])

.factory('$localstorage', ['$window', function($window) {
	return {
		set: function(key, value) {
			$window.localStorage[key] = value;
		},
		get: function(key, defaultValue) {
			return $window.localStorage[key] || { ids:[]};
		},
		setObject: function(key, value) {
			$window.localStorage[key] = JSON.stringify(value);
		},
		getObject: function(key) {
			if($window.localStorage[key] != undefined)
				return JSON.parse($window.localStorage[key] || { ids:[]} );

			return false;
		}
	}
}])

.factory('Utils', function(URL, $ionicLoading, $localstorage, $rootScope){
	
	var shuffle = function(array) {
		var m = array.length, t, i;
		while (m) {
		i = Math.floor(Math.random() * m--);
		t = array[m];
			array[m] = array[i];
			array[i] = t;
		}
		return array;
	}

	var showL = function() {
		$ionicLoading.show({
			template: '<i class="ion-loading-c"></i><br/>Loading...'
		});
	};

	var hideL = function(){
		$ionicLoading.hide();
	};

	/*
	var share = function(url){
		var url = url || URL;
		$cordovaSocialSharing.share('', '', null, url) // Share via native share sheet
		.then(function(result) {
			c(result);
		});
	};
	*/
	
	var stateOnlineChanged = function(){
		var newval = isOnline();
		$rootScope.online = newval;
		$rootScope.$broadcast('onlineUpdate', newval); 
	};

	var isOnline = function(){
		var value = $localstorage.get('online');
		var v = JSON.parse(value);
		return v;
	};

	/*
	var sendMail = function(email){
		var email = email || {
			to: '',
			cc: 'alessio.d@gmail.com',
			bcc: [],
			attachments: [
				//'file://img/logo.png',
				//'res://icon.png',
				//'base64:icon.png//iVBORw0KGgoAAAANSUhEUg...',
				//'file://README.pdf'
			],
			subject: 'Check out this great Ionic app',
			body: 'How are you? Nice greetings from Leipzig',
			isHtml: true
		};

		$cordovaEmailComposer.isAvailable().then(function() {
			// is available
			$cordovaEmailComposer.open(email).then(null, function () {
			// user cancelled email
			});

		}, function () {
			// not available
			alert('Sorry, email not avaiable');
		});

	};

	var rateApp = function(){
		$cordovaAppRate.promptForRating(true).then(function (result) {
			// success
		});
	};

	var appBrowser = function(url){
		var url = url || URL;
		$cordovaInAppBrowser.open(url, '_self', {})
		.then(function(event) {
			// success
		})
		.catch(function(event) {
			// error
		});
	};
	*/
	
	return { 
		showL: showL,
		hideL: hideL,
		shuffle: shuffle,
		isOnline: isOnline,
		stateOnlineChanged: stateOnlineChanged,
	};
})

.factory('Api', function($http, ApiEndpoint) {
	var K = "4a983d5abeb7573100f9c188b3a82021";
	var bUrl = function(endpoint, format){
		var format = format || 'json';
		return ApiEndpoint.url + endpoint + '?api_key='+K+'&format=' + format;
	};

	var get = function(endpoint) {
			return $http.get( bUrl(endpoint) )
		.then(function(data) {
			if(data.status === 200)
				return data.data;
			return 'What happened?';
		});
	};

	return {
		get: get
	};
})

.factory('Speakers', function(Api, $localstorage){
	var fetch = function(){
		var f = $localstorage.getObject('speakers');
		if(!f) {
			return Api.get('/user/list').then(function(data){
				$localstorage.setObject('speakers', data);
				return data;
			});
		}
		return f;

	}

	var get = function(name){
		var sp = fetch();
		for(var i in sp){
			if(sp[i].name.replace(/ /g,'') === name.replace(/ /g,'') )
				return sp[i];
		}
		return false;
	}
	
	return {
		get: get,
		fetch: fetch
	}

})

.factory('SessionsSv', function($localstorage, Api, $q) {
	
	var service = {};

	service.fetch = function(){
		var sessions = $localstorage.getObject('sessions');
		if(!sessions) {
			Api.get('/session/list').then(function(data){
				$localstorage.setObject('sessions', data);		
				return data;
			});
		}
		return sessions;
	}

	service.getBySpeaker = function(name){
		var sessions = service.fetch();
		c(sessions);
		var ret = [];
		for(var i in sessions){
			if( sessions[i].speakers){
				if(sessions[i].speakers[0].username == name )
					ret.push( sessions[i] );
			}
		}
		return ret;
	}

	service.getByType= function(name){
		var sessions = service.fetch();
		var ret = [];
		for(var i in sessions){
			if( sessions[i].type){
				if(sessions[i].type == name )
					ret.push( sessions[i] );
			}
		}
		return ret;
	}

	service._byId= function(id, sessions){
		for(s in sessions){
			if(sessions[s].id == id)
				return sessions[s];
		}
		return [];
	}

	service.get = function(id){
		var sessions = $localstorage.getObject('sessions');
		if(!sessions) {
			service.fetch().then(function(data){
				return service._byId(id, data)
			});
		} 

		return service._byId(id, sessions)
	}

	return service;
})


