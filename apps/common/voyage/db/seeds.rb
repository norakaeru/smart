p '*'*10
p 'init Voyage data'

require 'ruby-pinyin'

ports = %w(鳌江 宝山 北海 大连 丹东 定海 福州 广州 海口 黄岛 锦州 九州 连云港 龙口 旅顺 宁波 蓬菜 青岛 秦皇岛 泉州 三亚 上海 山海关 汕头 石岛 天津 威海 温州 厦门 烟台)

1000.times.each do |i|
  port_cn = ports[rand(ports.length)]
  port_en = PinYin.abbr(port_cn)
  Voyage::Port.create( port_code: i, port_name_cn: port_cn, port_name_en: port_en)
end