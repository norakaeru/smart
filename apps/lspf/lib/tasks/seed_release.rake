# encoding: utf-8
namespace :db do
  task :seed_release => :environment do
    puts 'running seeds_release.rb ....'
    load('db/seeds_release.rb')
   end
end