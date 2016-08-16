class GroupMenu < ActiveRecord::Base
  belongs_to :group
  belongs_to :menu

  def self.update_by_group(group_id, menus_ids)

    if menus_ids[:unchecked] && menus_ids[:unchecked].size
      self.where(group_id: group_id, menu_id: menus_ids[:unchecked]).delete_all
    end

    if menus_ids[:checked] && menus_ids[:checked].size
      menus_ids[:checked].each do |menu_id|
        self.find_or_create_by(group_id: group_id, menu_id: menu_id)
      end
    end
  end

end
