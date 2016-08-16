p '*'*10
p 'init Voyage data'

system = System.where(system_code: 'BASICDATA').first

modules = [
    {name: '运航管理', modules: [
        {name: '港口维护', permissions: [
            {code: 'query', name: '查询', controller: 'voyage/ports'},
            {code: 'edit', name: '编辑', controller: 'voyage/ports'},
            {code: 'delete', name: '删除', controller: 'voyage/ports'}
        ]},
        {name: '航线类型', permissions: [
            {code: 'query', name: '查询', controller: 'voyage/route_types'},
            {code: 'edit', name: '编辑', controller: 'voyage/route_types'},
            {code: 'delete', name: '删除', controller: 'voyage/route_types'}
        ]},
        {name: '航线维护', permissions: [
            {code: 'query', name: '查询', controller: 'voyage/routes'},
            {code: 'edit', name: '编辑', controller: 'voyage/routes'},
            {code: 'delete', name: '删除', controller: 'voyage/routes'}
        ]},
        {name: '航次信息', permissions: [
            {code: 'query', name: '查询', controller: 'voyage/voyages'},
            {code: 'edit', name: '编辑', controller: 'voyage/voyages'},
            {code: 'delete', name: '删除', controller: 'voyage/voyages'}
        ]},
        {name: '船舶类型', permissions: [
            {code: 'query', name: '查询', controller: 'voyage/vessel_types'},
            {code: 'edit', name: '编辑', controller: 'voyage/vessel_types'},
            {code: 'delete', name: '删除', controller: 'voyage/vessel_types'}
        ]},
        {name: '船舶国籍', permissions: [
            {code: 'query', name: '查询', controller: 'voyage/vessel_nationalities'},
            {code: 'edit', name: '编辑', controller: 'voyage/vessel_nationalities'},
            {code: 'delete', name: '删除', controller: 'voyage/vessel_nationalities'}
        ]},
        {name: '船舶信息', permissions: [
            {code: 'query', name: '查询', controller: 'voyage/vessels'},
            {code: 'edit', name: '编辑', controller: 'voyage/vessels'},
            {code: 'delete', name: '删除', controller: 'voyage/vessels'}
        ]}
    ]}
]

PermissionModule.merge_modules(modules, system)
