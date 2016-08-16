# encoding: utf-8
module JsonHelper

  # 有分页：{ total:100, items:[] }
  # 无分页：[ {}, {} ]
  def smart_json(params, json, result, &block)
    raise 'smart_json 参数错误! 第一个参数(params)不能为空 ' if params.nil?

    begin
      if params[:pageSize].present?
        items(json, result, &block)
        json.total result.total_entries
      else
        array(json, result, &block)
      end
    rescue => e
      raise 'smart_json 解析失败：' + e.message
    end
  end

  private

  def items(json, result, &block)
    if block.present?
      json.items result do |entry|
        block.call entry
      end
    else
      json.items result
    end
  end

  def array(json, result, &block)
    if block.present?
      json.array! result do |entry|
        block.call entry
      end
    else
      json.array! result
    end
  end

end