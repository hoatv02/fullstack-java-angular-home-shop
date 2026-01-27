export enum ACTION {
  CREATE = 'create',
  EDIT = 'edit',
  DETAIL = 'detail',
}

export function buildBreadcrumb(
  action: ACTION,
  moduleKey?: string | null,
  basePath?: string,
  i18nBasePath: string = 'Breadcrumbs.Administration'
) {
  const moduleSegment = moduleKey ? `.${moduleKey}` : '';

  const breadcrumb = [
    {
      label: `${i18nBasePath}${moduleSegment}.Title`,
      routerLink: basePath ?? ''
    }
  ];

  if (moduleKey && basePath) {
    breadcrumb.push({
      label:
        action === ACTION.CREATE
          ? `${i18nBasePath}${moduleSegment}.Create`
          : action === ACTION.EDIT
            ? `${i18nBasePath}${moduleSegment}.Edit`
            : `${i18nBasePath}${moduleSegment}.Detail`,
      routerLink: action === ACTION.CREATE ? `${basePath}/create` : `${basePath}/detail`
    });
  }

  return breadcrumb;
}
