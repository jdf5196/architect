app.config(['$routeProvider', function($routeProvider){
	$routeProvider
	.when('/',{
		templateUrl: '/views/home.html',
		controller: 'HomeCtrl'
	})
	.when('/projects',{
		templateUrl: '/views/projects.html',
		controller: 'projectsCtrl',
		resolve: {
			projectPromise: ['projectsList', function(projectsList){
				return projectsList.getAll();
			}]
		}
	})
	.when('/projects/:projectID',{
		templateUrl: '/views/projectID.html',
		controller: 'projectsIDCtrl',
		resolve: {
			projectPromise: ['projectsList', function(projectsList){
				return projectsList.getAll();
			}]
		}
	})
	.when('/news',{
		templateUrl: '/views/news.html',
		controller: 'newsCtrl',
		resolve: {
			newsPromise: ['newslist', function(newslist){
				return newslist.getAll();
			}]
		}
	})
	.when('/about',{
		templateUrl: '/views/about.html',
		controller: 'aboutCtrl'
	})
	.when('/contact',{
		templateUrl: '/views/contact.html',
		controller: 'contactCtrl'
	})
	.when('/edit', {
		templateUrl: '/views/edit.html',
		controller: 'editCtrl',
		resolve: {
			newsPromise: ['newslist', function(newslist){
				return newslist.getAll();
			}],
			projectPromise: ['projectsList', function(projectsList){
				return projectsList.getAll();
			}]
		}
	})
}]);s