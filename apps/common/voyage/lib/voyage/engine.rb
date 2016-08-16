module Voyage
  class Engine < ::Rails::Engine
    isolate_namespace Voyage

    config.i18n.load_path += Dir[File.expand_path('../../../config/locales/**/*.yml', __FILE__)]
    config.i18n.default_locale = 'zh-CN'
  end
end
