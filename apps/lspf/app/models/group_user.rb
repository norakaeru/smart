class GroupUser < ActiveRecord::Base
  belongs_to :group
  belongs_to :user

  def self.add_users(group_id, ids)
    group = Group.find_by_id(group_id)
    if group && ids
      User.where(id: ids).each do |user|
        self.find_or_create_by(user: user, group: group)
      end
    end
  end

  def self.remove_users(group_id, ids)
    (ids || []).each do |id|
      group_user = self.where(user_id: id, group_id: group_id)
      group_user.destroy_all
    end
  end
end
