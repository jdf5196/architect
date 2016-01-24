/*Service to get, create, update, and delete Projects*/

app.service('projectsList', ['$http', 'auth', function($http, auth){
	var projects = {
		projects: []
	};

	projects.getAll = function(){
		return $http.get('/projectlist').success(function(data){
			angular.copy(data, projects.projects);
		});
	};

	projects.create = function(project){
		return $http.post('/projectlist', project, {
			headers: {Authorization: 'Bearer '+auth.getToken()}
		}).success(function(data){
			projects.projects.push(data);
		});
	};

	projects.delete = function(project){
		$http.delete('/projectlist/' + project._id, {
			headers: {Authorization: 'Bearer '+auth.getToken()}
		}).success(function(){
			projects.projects.splice(projects.projects.indexOf(projects),1);
		});
	};

	projects.addImage = function(id, image){
		console.log(image);
		return $http.post('/projectlist/'+id+'/images', image, {
			headers: {Authorization: 'Bearer '+auth.getToken()}
		}).success(function(data){
		});
	};

	projects.update = function(project, id){
		return $http.put('/projectlist/'+id, project, {
			headers: {Authorization: 'Bearer '+auth.getToken()}
		}).success(function(data){
		});
	};

	projects.deleteImage = function(image, id){
		return $http.put('/projectlist/'+id+'/images', image, {
			headers: {Authorization: 'Bearer '+auth.getToken()}
		}).success(function(data){
		});
	};

	return projects;
}]);

/*Service to get, create, update, and delete news articles*/

app.service('newslist', ['$http', 'auth', function($http, auth){
	var news = {
		news: []
	};

	news.getAll = function(){
		return $http.get('/newslist').success(function(data){
			angular.copy(data, news.news);
		});
	};

	news.create = function(news){
		return $http.post('/newslist', news, {
			headers: {Authorization: 'Bearer '+auth.getToken()}
		});
	};

	news.update = function(news, id){
		return $http.put('/newslist/'+id, news, {
			headers: {Authorization: 'Bearer '+auth.getToken()}
		}).success(function(data){
		});
	};

	news.delete = function(news){
		$http.delete('/newslist/' + news._id, {
			headers: {Authorization: 'Bearer '+auth.getToken()}
		});
	};

	return news;
}]);

/*Service to login and register new users*/

app.service('auth', ['$http', '$window', function($http, $window){
	var auth = {};

	auth.saveToken = function(token){
		$window.localStorage['architect-token'] = token;
	};

	auth.getToken = function(){
		return $window.localStorage['architect-token'];
	};

	auth.isLoggedIn = function(){
		var token = auth.getToken();

		if(token){
			var payload = JSON.parse($window.atob(token.split('.')[1]));
			return payload.exp > Date.now() / 1000;
		}
		else{
			return false;
		}
	};

	auth.isLoggedOut = function(){
		var token = auth.getToken();
		if(!token){
			return true;
		}
	};

	auth.currentUser = function(){
		if(auth.isLoggedIn()){
			var token = auth.getToken();
			var payload = JSON.parse($window.atob(token.split('.')[1]));

			return payload;
		}
	};

	auth.register = function(user){
		return $http.post('/register', user).success(function(data){
			window.alert('Email sent with password.')
		});
	};

	auth.logIn = function(user){
		return $http.post('/login', user).success(function(data){
			auth.saveToken(data.token);
		});
	};

	auth.logOut = function(){
		$window.localStorage.removeItem('architect-token');
	};

	return auth;
}]);
