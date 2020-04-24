require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name		= "react-native-bluetooth-serial"
  s.summary		= "Bluetooth serial for react native."
  s.version		= package['version']
  s.authors		= { "Jakub Martyčák" => "https://github.com/rusel1989" }
  s.homepage    	= "https://github.com/rusel1989/react-native-bluetooth-serial"
  s.license     	= "Apache-2.0"
  s.platform    	= :ios, "8.0"
  s.source      	= { :git => "https://github.com/rusel1989/react-native-bluetooth-serial.git" }
  s.source_files	= "ios/**/*.{h,m}"

  s.dependency 'React'
end
