import PageNotAllowed from '@components/common/page/PageNotAllowed';
import Dashboard from '@modules/dashboard';

/*
	auth
		+ null: access login and not login
		+ true: access login only
		+ false: access not login only
*/
const routes = {
    pageNotAllowed: {
        path: '/not-allowed',
        component: PageNotAllowed,
        auth: null,
        title: 'Page not allowed',
    },
    homePage: {
        path: '/dashboard',
        component: Dashboard,
        auth: true,
        title: 'Home',
    },
    // keep this at last
    notFound: {
        // component: PageNotFound,
        component: Dashboard,
        auth: null,
        title: 'Page not found',
        path: '*',
    },
};

export default routes;
