# encoding: utf-8
module ApplicationHelper
end

class SmartFormBuilder < ActionView::Helpers::FormBuilder

  def text_field(attribute, options={})
    result = self.label(attribute, options)
    result + super
  end

  def text_area(attribute, options={})
    result = self.label(attribute, options)
    result + super
  end

  def check_box(attribute, options={})
    result = self.label(attribute, options)
    result + super
  end

  def radio_button(attribute, options={})
    result = self.label(attribute, options)
    result + super
  end

  def password_field(attribute, options={})
    result = self.label(attribute, options)
    result + super
  end

  def select(method, choices, html_options = {})
    result = self.label(method, html_options)
    result + super(method, choices, options = {}, html_options)
  end

  def label(attribute, options)
    if options.include? :label
      label_options = options[:label]
      options.delete :label

      super(attribute, label_options)
    end
  end

end