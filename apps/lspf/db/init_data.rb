# encoding: utf-8

p "更新或创建module && permission权限=========》"

# 加载每个插件中的 init_data.rb
def load_init_data engine
  File.load engine.paths['db'].existent.first + '/init_data.rb'
end

load_init_data Voyage::Engine





