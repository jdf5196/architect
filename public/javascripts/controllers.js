app.controller('MainCtrl', ['$scope', '$location', 'auth', function($scope, $location, auth){

	$scope.isLoggedIn = auth.isLoggedIn;

		$scope.init = function(){
			var path = $location.path();
			for(var i = 1; i <= $location.path().length; i++){
				if($location.path()[i]==='/'){
					path = $location.path().slice(0, i)
				}
			}
			console.log(path)

			if(path === '/' || path === '#' || path === ''){
				$scope.backgroundImage = '/images/pittsburgh.jpg';
				$scope.class = 'homeNav';
			}
			else if(path === '/projects' || path === '/projects/1'){
				$scope.backgroundImage = '/images/desk.jpeg';
				$scope.class = 'pageNav';
			}
			else if(path === '/news'){
				$scope.backgroundImage = '/images/news.jpeg';
				$scope.class = 'pageNav';
			}
			else if(path === '/about'){
				$scope.backgroundImage = '/images/park.jpg';
				$scope.class = 'pageNav';
			}
			else if(path === '/contact'){
				$scope.backgroundImage = '/images/write.jpeg';
				$scope.class = 'pageNav';
			};
		}

		$scope.background = function(location){
			if(location === 'home'){
				$scope.backgroundImage = '/images/pittsburgh.jpg';
				$scope.class = 'homeNav';
			}
			if(location === 'projects'){
				$scope.backgroundImage = '/images/desk.jpeg';
				$scope.class = 'pageNav';
			}
			if(location === 'news'){
				$scope.backgroundImage = '/images/news.jpeg';
				$scope.class = 'pageNav';
			}
			if(location === 'about'){
				$scope.backgroundImage = '/images/park.jpg';
				$scope.class = 'pageNav';
			}
			if(location === 'contact'){
				$scope.backgroundImage = '/images/write.jpeg'
				$scope.class = 'pageNav';
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
			console.log($scope.project.images[1].url);
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

app.controller('editCtrl', ['$scope', 'newslist', 'projectsList', 'auth', function($scope, newslist, projectsList, auth){
	$scope.news = newslist.news;
	$scope.projects = projectsList.projects;
	$scope.isLoggedOut = auth.isLoggedOut;
	$scope.isLoggedIn = auth.isLoggedIn;
	$scope.logOut = auth.logOut;
	$scope.user = {};

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
		console.log(payload());
		newslist.delete(news);
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
		var date = new Date();
		projectsList.create({
			title: $scope.projectTitle,
			description: $scope.description1,
			description2: $scope.description2,
			mainImage: $scope.mainImage,
			type: $scope.type,
			url: $scope.url,
			date: date
		});

	};

	$scope.deleteProject = function(project){
		projectsList.delete(project);
	};

	$scope.updateProject = function(project){
		projectsList.update({
			title: project.title,
			description: project.description,
			description2: project.description2,
			mainImage: project.mainImage,
			type: project.type,
			url: project.url,
			date: project.date
		}, project._id);
	};

	$scope.imageAdd = function(project){
		projectsList.addImage(project._id, {
			url:project.imageUrl,
			description: project.imageDescription
		});
	};

	$scope.deleteImage = function(image, project){
		projectsList.deleteImage(image, project._id);
	};

	$scope.register = function(){
		auth.register($scope.user).error(function(error){
			$scope.error = error;
		});
	};

	$scope.logIn = function(){
		auth.logIn($scope.user).error(function(error){
			$scope.error = error;
		});
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