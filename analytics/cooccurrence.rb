require 'csv'

cooccur_selfie = {}
cooccur_brunch = {}
cooccur_nofilter = {}
cooccur_starbucks = {}

CSV.foreach('data/recent.csv', 'rb') do |post|
  tags = post[2].split(', ')
  if tags.include?('selfie')
    tags.each do |tag|
      if tag != 'selfie' 
        if !cooccur_selfie.has_key?(tag)
      	  cooccur_selfie[tag] = 1
        else
	  cooccur_selfie[tag] += 1
        end
      end
    end
  end
  if tags.include?('brunch')
    tags.each do |tag|
      if tag != 'brunch'
        if !cooccur_brunch.has_key?(tag)
          cooccur_brunch[tag] = 1
        else
          cooccur_brunch[tag] += 1
        end
      end
    end
  end
  if tags.include?('nofilter')
    tags.each do |tag|
      if tag != 'nofilter'
        if !cooccur_nofilter.has_key?(tag)
          cooccur_nofilter[tag] = 1
        else
          cooccur_nofilter[tag] += 1
        end
      end
    end
  end
  if tags.include?('starbucks')
    tags.each do |tag|
      if tag != 'starbucks'
        if !cooccur_starbucks.has_key?(tag)
          cooccur_starbucks[tag] = 1
        else
          cooccur_starbucks[tag] += 1
        end
      end
    end
  end
end  

cooccur_selfie = cooccur_selfie.sort_by{|k,v| v}.reverse
cooccur_brunch = cooccur_brunch.sort_by{|k,v| v}.reverse
cooccur_nofilter = cooccur_nofilter.sort_by{|k,v| v}.reverse
cooccur_starbucks = cooccur_starbucks.sort_by{|k,v| v}.reverse

CSV.open('data/selfie-cooccurrence.csv', 'wb') do |csv|
  csv << ['hashtag', 'occurrence']
  for i in 0..19
    csv << cooccur_selfie[i]
  end
end
CSV.open('data/brunch-cooccurrence.csv', 'wb') do |csv|
  csv << ['hashtag', 'occurrence']
  for i in 0..19
    csv << cooccur_brunch[i]
  end
end
CSV.open('data/nofilter-cooccurrence.csv', 'wb') do |csv|  
  csv << ['hashtag', 'occurrence']
  for i in 0..19
    csv << cooccur_nofilter[i]
  end
end
CSV.open('data/starbucks-cooccurrence.csv', 'wb') do |csv|
  csv << ['hashtag', 'occurrence']
  for i in 0..19
    csv << cooccur_starbucks[i]
  end
end

puts "success!"
