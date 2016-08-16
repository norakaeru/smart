class SmartValidateError < SmartStandardError

  # @param [Symbol] key 比如 :route_errors
  # @param [Hash] errors 抛出的异常 , @route.errors
  def initialize(key, errors = nil)

    @notice = '表单填写错误，请重试'
    @data = {}

    if key.is_a? Symbol
      @data[key] = errors
    elsif key.is_a? Hash
      @data = key.clone
    end
  end

end