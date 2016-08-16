class SmartAbility
  include CanCan::Ability

  # :manage： 是指這個 controller 內所有的 action
  # :read : 是指 :index 和 :show
  # :create： 是指 :new 和 :create
  # :update： 是指 :edit 和 :update
  # :destroy： 是指 :destroy
  # :all 是指所有 object (resource)

  # See the wiki for details:
  # https://github.com/CanCanCommunity/cancancan/wiki/Defining-Abilities

  def initialize(user, controller_path)
    alias_action :multi_delete, :to => :destroy

    user ||= User.new
    roles = user.roles
    permissions = user.permissions(controller_path)
    subject_class = controller_path.classify.constantize

    can :manage, subject_class                    if roles.include?("admin")

    can [:read, :new], subject_class              if permissions.include?("query") #查询权限

    can [:create, :update], subject_class         if permissions.include?("edit") #编辑权限

    can [:destroy], subject_class                 if permissions.include?("delete") #删除权限

    can :submit, subject_class                    if permissions.include?("audit") #审核权限

  end

end
