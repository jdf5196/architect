app.controller('MainCtrl', ['$scope', '$location', 'auth', function($scope, $location, auth){

	$scope.isLoggedIn = auth.isLoggedIn;

		$scope.init = function(){
			var path = $location.path();
			for(var i = 1; i <= $location.path().length; i++){
				if($location.path()[i]==='/'){
					path = $location.path().slice(0, i)
				}
			}

			if(path === '/' || path === '#' || path === ''){
				$scope.class = 'homeNav';
			}
			else{
				$scope.class = 'pageNav'
			}
		}

}]);

app.controller('HomeCtrl', ['$scope', 'projectsList', function($scope, projectsList){
	$scope.projects = projectsList;
}]);

app.controller('projectsCtrl', ['$scope', 'projectsList', function($scope, projectsList){
	$scope.projects = projectsList.projects;
}]);

app.controller('projectsIDCtrl', ['$scope', '$routeParams', 'projectsList', function($scope, $routeParams, projectsList){


	for(var i = 0; i<projectsList.projects.length; i++){
		if($routeParams.projectID == projectsList.projects[i].url){
			$scope.project = projectsList.projects[i];
		};
	};

	$scope.currentIndex = 0;

	$scope.setCurrentSlideIndex = function(index){
		$scope.currentIndex = index;
	};

	$scope.isCurrentSlideIndex = function(index){
		return $scope.currentIndex === index;
	};

	$scope.nextSlide = function(){
		$scope.currentIndex = ($scope.currentIndex < $scope.project.images.length - 1) ? ++$scope.currentIndex: 0;
	};

	$scope.prevSlide = function(){
		$scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.project.images.length - 1;
	};

}]);

app.controller('newsCtrl', ['$scope', 'newslist', function($scope, newslist){
	$scope.news = newslist.news;
}]);

app.controller('aboutCtrl', ['$scope', function($scope){

}]);

app.controller('contactCtrl', ['$scope', '$http', function($scope, $http){
	$scope.sendMail = function(){

		var data = ({
			contactEmail: $scope.contactEmail,
			contactName: $scope.contactName,
			contactMessage: $scope.contactMessage
		});
		$http.post('/contact', data).success(function(){
			window.alert('Message Sent');
			$scope.contactEmail = '';
			$scope.contactName = '';
			$scope.contactMessage = '';
		});
	}
}]);

app.controller('editCtrl', ['$scope', 'newslist', 'projectsList', 'auth', '$http', function($scope, newslist, projectsList, auth, $http){
	$scope.news = newslist.news;
	$scope.projects = projectsList.projects;
	$scope.isLoggedOut = auth.isLoggedOut;
	$scope.isLoggedIn = auth.isLoggedIn;
	$scope.logOut = auth.logOut;
	var payload = auth.currentUser();

	$scope.reload = function(){
		window.location.reload();
	}

	$scope.addNews = function(){
		var date = new Date();
		if(!$scope.title || $scope.title === '' || !$scope.publication || $scope.publication === ''){return};
		newslist.create({
			publication: $scope.publication,
			title: $scope.title,
			author: $scope.author,
			description: $scope.description,
			url: $scope.link,
			date: date
		});
	};

	$scope.deleteNews = function(news){
		newslist.delete(news);
	};

	$scope.showDetail = function(news){
		if($scope.active != news._id){
			$scope.active = news._id;
		}
		else{
			$scope.active = null;
		}
	};

	$scope.showProject = function(project){
		if($scope.active != project._id){
			$scope.active = project._id;
		}
		else{
			$scope.active = null;
		}
	};

	$scope.updateNews = function(news){
		newslist.update({
			publication: news.publication,
			title: news.title,
			author: news.author,
			description: news.description,
			url: news.url,
			date: news.date
		}, news._id);
	};

	$scope.addProject = function(){
		var image = $scope.mainImage;
		var date = new Date();
		var drop = image.substring(0, 23);
		var finalImage = '';
		if(drop === 'https://www.dropbox.com'){
			var finalImage = 'https://dl.dropboxusercontent.com'+image.substring(23, image.length-5)+'?raw=0';
		}
		else{
			var finalImage = image;
		};
		projectsList.create({
			title: $scope.projectTitle,
			description: $scope.description1,
			description2: $scope.description2,
			mainImage: finalImage,
			type: $scope.type,
			url: $scope.url,
			date: date
		});

	};

	$scope.deleteProject = function(project){
		projectsList.delete(project);
	};

	$scope.updateProject = function(project){
		var image = project.mainImage;
		var date = new Date();
		var drop = image.substring(0, 23);
		var finalImage = '';
		if(drop === 'https://www.dropbox.com'){
			var finalImage = 'https://dl.dropboxusercontent.com'+image.substring(23, image.length-5)+'?raw=0';
		}
		else{
			var finalImage = image;
		};
		projectsList.update({
			title: project.title,
			description: project.description,
			description2: project.description2,
			mainImage: finalImage,
			type: project.type,
			url: project.url,
			date: project.date
		}, project._id);
	};

	$scope.imageAdd = function(project){
		var drop = project.imageUrl.substring(0, 23);
		var image = '';
		if(drop === 'https://www.dropbox.com'){
			var image = 'https://dl.dropboxusercontent.com'+project.imageUrl.substring(23, project.imageUrl.length-5)+'?raw=0';
		}
		else{
			var image = project.imageUrl;
		};
		projectsList.addImage(project, {
			url:image,
			description: project.imageDescription
		}).success(function(){
			project.imageUrl = '';
			project.imageDescription = '';
		});
	};

	$scope.deleteImage = function(image, project){
		projectsList.deleteImage(image, project);
	};

	$scope.register = function(){
		auth.register($scope.userRegister).error(function(error){
			$scope.error = error;
		});
	};

	$scope.logIn = function(){
		auth.logIn($scope.userLogIn).error(function(error){
			$scope.error = error;
			$scope.userLogIn.username = '';
			$scope.userLogIn.password = '';
		}).success(function(){
			$scope.userLogIn.username = '';
			$scope.userLogIn.password = '';
		});
	};

	$scope.change = function(){
		if($scope.change.newPassword != $scope.change.newPassword2){
			window.alert('Passwords do not match');
			return
		}
		else{
			auth.change(payload._id, {
				oldPassword: $scope.change.currentPassword,
				Password: $scope.change.newPassword
			}).error(function(error){
				$scope.error = error;
				$scope.change.currentPassword = '';
				$scope.change.newPassword = '';
				$scope.change.newPassword2 = '';
			}).success(function(){
				$scope.change.currentPassword = '';
				$scope.change.newPassword = '';
				$scope.change.newPassword2 = '';
			});
		};
	};

}]);

app.controller('navCtrl', ['$scope', '$location', function($scope, $location){
	$scope.isActive = function(viewLocation){
		var path = $location.path();
		for(var i = 1; i<$location.path().length; i++){
			if($location.path()[i]==='/'){
				path = $location.path().slice(0, i)
			}
		}
		return viewLocation === path;
	};
}]);