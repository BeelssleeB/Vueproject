import {getRequest} from "./api";

export const initMenu = (router, store) => {
    if (store.state.routes.length > 0) {
        return;
    }
    getRequest("/init/menu").then(data => {
        if (data) {
            let fmtRoutes = formatRoutes(data);
            router.addRoutes(fmtRoutes);
            store.commit('initRoutes', fmtRoutes);
        }
    })
}
export const formatRoutes = (routes) => {
    let fmRoutes = [];
    routes.forEach(router => {
        let{
            path,
            icon,
            nameCh,
            children,
            component
        } = router;
        if (children && children instanceof Array) {
            children = formatRoutes(children);
        }
        let fmRouter = {
            path: path,
            name: nameCh,
            icon: icon,
            nameCh: nameCh,
            children: children,
            component(resolve) {
                require(['../views/' + component + '.vue'], resolve)
            }
        }
        fmRoutes.push(fmRouter);
    })
    return fmRoutes;
}