# Load the Rails application.
require File.expand_path('../application', __FILE__)

# Initialize the Rails application.
Bendr::Application.initialize!
Bendr::Application.configure do
  S3 = false
end

