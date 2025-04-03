import PageNotAllowed from '@components/common/page/PageNotAllowed';
import FlowEditor from '@modules/dashboard';

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
        path: '/editor/cyoa',
        component: FlowEditor,
        auth: true,
        title: 'Home',
    },
    // keep this at last
    notFound: {
        // component: PageNotFound,
        component: FlowEditor,
        auth: null,
        title: 'Page not found',
        path: '*',
    },
};

export default routes;
