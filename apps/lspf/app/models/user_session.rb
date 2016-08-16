class UserSession < Authlogic::Session::Base
  remember_me_for(7.days)
end
