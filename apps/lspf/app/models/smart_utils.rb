module SmartUtils

  def base_select(result, pages, sort=nil, filter=nil)
    if pages.present?
      result = result.paginate(:page => pages[:page], :per_page => pages[:pageSize])
    end

    if sort.present?
      sorts = sort_params sort
      result = result.order(sorts.join(','))
    end

    if filter.present?
      filters = filter_params filter
      result = result.where(filters[:conditions].join(" #{filters[:logic]} "), filters[:values])
    end

    result
  end

  def multi_delete(id_arr)
    if id_arr.present?
      id_arr.each do |id|
        if id.present?
          obj = self.find_by_id(id)
          obj.destroy if obj.present?
        end
      end
    end
  end

  # {"0"=>{"field"=>"port_code", "dir"=>"asc"}, "1"=>{"field"=>"port_name_cn", "dir"=>"desc"}}
  def sort_params sort
    sorts = []
    sort.each do |_, s|
      sorts << "#{s[:field]} #{s[:dir]}"
    end
    sorts
  end

  # {"logic"=>"and", "filters"=>{"0"=>{"field"=>"port_name_cn", "operator"=>"eq", "value"=>"SS"},
  #                              "1"=>{"field"=>"port_code", "operator"=>"eq", "value"=>"SS"}}}

  # {"logic"=>"and", "filters"=>{"0"=>{"field"=>"port_name_cn", "operator"=>"eq", "value"=>"SS"},
  #                              "1"=>{"logic"=>"or", "filters"=>{"0"=>{"field"=>"port_code", "operator"=>"eq", "value"=>"SSS"}, "1"=>{"field"=>"port_code", "operator"=>"eq", "value"=>"SS"}}}}}

  # {"logic"=>"and", "filters"=>{"0"=>{"logic"=>"or", "filters"=>{"0"=>{"field"=>"port_name_cn", "operator"=>"eq", "value"=>"SS"},"1"=>{"field"=>"port_name_cn", "operator"=>"eq", "value"=>"SS"}}},
  #                              "1"=>{"logic"=>"or", "filters"=>{"0"=>{"field"=>"port_code", "operator"=>"eq", "value"=>"SSS"}, "1"=>{"field"=>"port_code", "operator"=>"eq", "value"=>"SS"}}}}}
  def filter_params filter
    conditions, values = [], {}
    filter[:filters].each do |i,f|

      if f.has_key? :logic
        result = {}
        _conditions, _values = [], {}
        f[:filters].each do |ii,ff|
          _result = constitute ii,ff
          _conditions << _result[:condition]
          _values.merge! _result[:value]
        end
        result[:condition] = '(' + _conditions.join(" #{f[:logic]} ") + ')'
        result[:value] = _values
      else
        result = constitute(i,f)
        p result
      end

      conditions << result[:condition]
      values.merge! result[:value]
    end

    {conditions: conditions, logic: filter[:logic], values: values}
  end

  private

  # 解析单列的最小条件集
  # @params: 0,1,2 (引入index避免key值重复)
  # @params: {"field"=>"port_code", "operator"=>"eq", "value"=>"SS"}
  # @return: {condition=>"port_code = :port_code_0", :value=>{:port_code_0=>"SS"}}
  def constitute index, filter
    field, op, value = filter[:field], filter[:operator], filter[:value]
    map = {}
    key = "#{field}_#{index}"
    case op.to_sym
      when :startswith
        map[key.to_sym] = "#{value}%"
      when :endswith
        map[key.to_sym] = "%#{value}"
      when :contains, :doesnotcontain
        map[key.to_sym] = "%#{value}%"
      else
        map[key.to_sym] = value
    end
    query = "#{field} #{substitute op} :#{key}"

    {condition: query, value: map}
  end

  # 替换为sql逻辑字符
  def substitute symbol
    operators = {eq: '=', neq: '<>', startswith: 'like', contains: 'like', doesnotcontain: 'not like', endswith: 'like', gte: '>=', gt: '>', lte: '<=', lt: '<'}
    operators[symbol.to_sym]
  end

end