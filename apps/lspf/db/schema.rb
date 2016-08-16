# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160805072233) do

  create_table "group_menus", force: true do |t|
    t.integer  "group_id"
    t.integer  "menu_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "group_menus", ["group_id"], name: "index_group_menus_on_group_id", using: :btree
  add_index "group_menus", ["menu_id"], name: "index_group_menus_on_menu_id", using: :btree

  create_table "group_permissions", force: true do |t|
    t.integer  "group_id"
    t.integer  "permission_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "group_permissions", ["group_id"], name: "index_group_permissions_on_group_id", using: :btree
  add_index "group_permissions", ["permission_id"], name: "index_group_permissions_on_permission_id", using: :btree

  create_table "group_roles", force: true do |t|
    t.integer  "group_id"
    t.integer  "role_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "group_roles", ["group_id"], name: "index_group_roles_on_group_id", using: :btree
  add_index "group_roles", ["role_id"], name: "index_group_roles_on_role_id", using: :btree

  create_table "group_users", force: true do |t|
    t.integer  "group_id"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "group_users", ["group_id"], name: "index_group_users_on_group_id", using: :btree
  add_index "group_users", ["user_id"], name: "index_group_users_on_user_id", using: :btree

  create_table "groups", force: true do |t|
    t.string   "name"
    t.string   "code"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "menus", force: true do |t|
    t.string   "system_code"
    t.string   "plugin_code"
    t.string   "label"
    t.string   "route"
    t.string   "controller"
    t.string   "action"
    t.string   "menu_type"
    t.integer  "parent_menu_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "permission_modules", force: true do |t|
    t.string   "name"
    t.string   "system_code"
    t.integer  "parent_module_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "permissions", force: true do |t|
    t.string   "code"
    t.string   "name"
    t.string   "controller"
    t.integer  "permission_module_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "roles", force: true do |t|
    t.string   "name"
    t.string   "code"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "sessions", force: true do |t|
    t.string   "session_id", null: false
    t.text     "data"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "sessions", ["session_id"], name: "index_sessions_on_session_id", unique: true, using: :btree
  add_index "sessions", ["updated_at"], name: "index_sessions_on_updated_at", using: :btree

  create_table "systems", force: true do |t|
    t.string   "system_code"
    t.string   "system_name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", force: true do |t|
    t.string   "name"
    t.string   "account"
    t.string   "email"
    t.string   "crypted_password"
    t.string   "password_salt"
    t.string   "persistence_token"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "voyage_ports", force: true do |t|
    t.string   "port_code"
    t.string   "port_name_en"
    t.string   "port_name_cn"
    t.string   "operator"
    t.string   "remark"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "voyage_route_ports", force: true do |t|
    t.integer  "port_type_id"
    t.integer  "port_id"
    t.integer  "route_id"
    t.string   "operator"
    t.string   "remark"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "voyage_route_ports", ["port_id"], name: "index_voyage_route_ports_on_port_id", using: :btree
  add_index "voyage_route_ports", ["route_id"], name: "index_voyage_route_ports_on_route_id", using: :btree

  create_table "voyage_route_types", force: true do |t|
    t.string   "type_code"
    t.string   "type_name"
    t.string   "operator"
    t.string   "remark"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "voyage_routes", force: true do |t|
    t.string   "route_code"
    t.string   "route_name"
    t.integer  "route_type_id"
    t.string   "operator"
    t.string   "remark"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "voyage_routes", ["route_type_id"], name: "index_voyage_routes_on_route_type_id", using: :btree

end
