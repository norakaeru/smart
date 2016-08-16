class SmartStandardError < StandardError

  def initialize(msg = nil, data = {})
    @notice = msg
    @data = data
  end

  def to_json
    msg = {notice: @notice, data: @data}
    msg.to_json
  end

  def notice
    @notice
  end

  def data
    @data
  end

end