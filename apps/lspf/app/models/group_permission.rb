class GroupPermission < ActiveRecord::Base
  belongs_to :group
  belongs_to :permission

  def self.update_by_group(group_id, permission_ids)

    if permission_ids[:unchecked]  && permission_ids[:unchecked].size
      self.where(group_id: group_id, permission_id: permission_ids[:unchecked] ).delete_all
    end

    if permission_ids[:checked]  && permission_ids[:checked].size
      permission_ids[:checked] .each do |id|
        self.find_or_create_by(group_id: group_id, permission_id: id)
      end
    end
  end

end
