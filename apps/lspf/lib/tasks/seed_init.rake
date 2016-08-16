# encoding: utf-8
namespace :db do
  task :init => :environment do
    puts 'running init_data.rb ....'
    load('db/init_data.rb')
  end
end