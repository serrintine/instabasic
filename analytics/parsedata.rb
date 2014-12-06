require 'json'
require 'pg'
require 'csv'

postgres = PG::Connection.new('ec2-23-23-210-37.compute-1.amazonaws.com', '5432', nil, nil, 'd5j3f1u3bib3th', 'ezmutynhgyvwis', '3iU5A11f1z85h_W0VdkvV5LBr8')
query = postgres.exec('select * from instagram limit 1000;')

counter = 0;

entry = []
res = {}
valid_data = []

query.each do |row|
  entry = []
  row.each do |column|
    entry += column
  end
  jsonObj = JSON.parse(entry[1])
  jsonObj['data'].each do |post|
    loc = post['location']
    if loc && loc['latitude'] 
        tags = post['tags']
        tags = tags.to_s.gsub(/[\[\]]/, '')
	tags = tags.to_s.gsub(/[""]/, '')
        tags = tags.to_s.split(", ")
        valid_data = [loc['latitude'], loc['longitude'], tags.join(", "), post['created_time']]
	res[post['link']] = valid_data
    end
  end
end

CSV.open('data/recent.csv', 'wb') do |csv|
  csv << ['latitude', 'longitude', 'hashtag', 'timestamp']
  res.each do |entry|
    csv << entry[1]
  end
end
puts 'success!'
