// data/carData.js
export const carData = [
  //TOYOTA
  // Toyota Vios
  { make: "Toyota", model: "Vios 1.3J", years: Array.from({ length: 2025 - 2003 + 1 }, (_, i) => 2003 + i), marketValue: 35000, engineCapacity: 1300 },
  { make: "Toyota", model: "Vios 1.5E", years: Array.from({ length: 2025 - 2003 + 1 }, (_, i) => 2003 + i), marketValue: 75000, engineCapacity: 1500 },
  { make: "Toyota", model: "Vios 1.5G", years: Array.from({ length: 2025 - 2003 + 1 }, (_, i) => 2003 + i), marketValue: 85000, engineCapacity: 1500 },
  { make: "Toyota", model: "Vios 1.5S", years: Array.from({ length: 2025 - 2007 + 1 }, (_, i) => 2007 + i), marketValue: 48000, engineCapacity: 1500 },
  { make: "Toyota", model: "Vios 1.5G GR-S", years: Array.from({ length: 2025 - 2021 + 1 }, (_, i) => 2021 + i), marketValue: 85000, engineCapacity: 1500 },

  // Toyota Veloz
  { make: "Toyota", model: "Veloz 1.5E", years: Array.from({ length: 2025 - 2022 + 1 }, (_, i) => 2022 + i), marketValue: 90000, engineCapacity: 1500 },
  { make: "Toyota", model: "Veloz 1.5G", years: Array.from({ length: 2025 - 2022 + 1 }, (_, i) => 2022 + i), marketValue: 94000, engineCapacity: 1500 },
  { make: "Toyota", model: "Veloz 1.5AV", years: Array.from({ length: 2025 - 2022 + 1 }, (_, i) => 2022 + i), marketValue: 98000, engineCapacity: 1500 },

  // Toyota Camry
  { make: "Toyota", model: "Camry 2.0E", years: Array.from({ length: 2018 - 2002 + 1 }, (_, i) => 2002 + i), marketValue: 110000, engineCapacity: 2000 },
  { make: "Toyota", model: "Camry 2.0G", years: Array.from({ length: 2018 - 2002 + 1 }, (_, i) => 2002 + i), marketValue: 120000, engineCapacity: 2000 },
  { make: "Toyota", model: "Camry 2.4V", years: Array.from({ length: 2018 - 2002 + 1 }, (_, i) => 2002 + i), marketValue: 140000, engineCapacity: 2400 },
  { make: "Toyota", model: "Camry 2.5V", years: Array.from({ length: 2025 - 2019 + 1 }, (_, i) => 2019 + i), marketValue: 165000, engineCapacity: 2500 },

  // Toyota Corolla Altis
  { make: "Toyota", model: "Corolla Altis 1.6E", years: Array.from({ length: 2018 - 2001 + 1 }, (_, i) => 2001 + i), marketValue: 60000, engineCapacity: 1600 },
  { make: "Toyota", model: "Corolla Altis 1.8E", years: Array.from({ length: 2025 - 2001 + 1 }, (_, i) => 2001 + i), marketValue: 89000, engineCapacity: 1800 },
  { make: "Toyota", model: "Corolla Altis 2.0V", years: Array.from({ length: 2018 - 2010 + 1 }, (_, i) => 2010 + i), marketValue: 90000, engineCapacity: 2000 },
  { make: "Toyota", model: "Corolla Altis 1.8G", years: Array.from({ length: 2025 - 2019 + 1 }, (_, i) => 2019 + i), marketValue: 115000, engineCapacity: 1800 },

  // Toyota Yaris
  { make: "Toyota", model: "Yaris 1.5J", years: Array.from({ length: 2025 - 2019 + 1 }, (_, i) => 2019 + i), marketValue: 68000, engineCapacity: 1500 },
  { make: "Toyota", model: "Yaris 1.5E", years: Array.from({ length: 2025 - 2019 + 1 }, (_, i) => 2019 + i), marketValue: 72000, engineCapacity: 1500 },
  { make: "Toyota", model: "Yaris 1.5G", years: Array.from({ length: 2025 - 2019 + 1 }, (_, i) => 2019 + i), marketValue: 75000, engineCapacity: 1500 },

  // Toyota Fortuner
  { make: "Toyota", model: "Fortuner 2.4G", years: Array.from({ length: 2025 - 2005 + 1 }, (_, i) => 2005 + i), marketValue: 160000, engineCapacity: 2400 },
  { make: "Toyota", model: "Fortuner 2.4V", years: Array.from({ length: 2025 - 2016 + 1 }, (_, i) => 2016 + i), marketValue: 170000, engineCapacity: 2400 },
  { make: "Toyota", model: "Fortuner 2.7 SRZ", years: Array.from({ length: 2025 - 2016 + 1 }, (_, i) => 2016 + i), marketValue: 180000, engineCapacity: 2700 },

  // Toyota Innova
  { make: "Toyota", model: "Innova 2.0E", years: Array.from({ length: 2025 - 2005 + 1 }, (_, i) => 2005 + i), marketValue: 85000, engineCapacity: 2000 },
  { make: "Toyota", model: "Innova 2.0G", years: Array.from({ length: 2025 - 2005 + 1 }, (_, i) => 2005 + i), marketValue: 110000, engineCapacity: 2000 },
  { make: "Toyota", model: "Innova 2.0X", years: Array.from({ length: 2025 - 2016 + 1 }, (_, i) => 2016 + i), marketValue: 115000, engineCapacity: 2000 },

  // Toyota Alphard
  { make: "Toyota", model: "Alphard 2.4", years: Array.from({ length: 2014 - 2005 + 1 }, (_, i) => 2005 + i), marketValue: 220000, engineCapacity: 2400 },
  { make: "Toyota", model: "Alphard 3.5V6", years: Array.from({ length: 2025 - 2008 + 1 }, (_, i) => 2008 + i), marketValue: 350000, engineCapacity: 3500 },
  { make: "Toyota", model: "Alphard 2.5", years: Array.from({ length: 2025 - 2015 + 1 }, (_, i) => 2015 + i), marketValue: 350000, engineCapacity: 2500 },
  { make: "Toyota", model: "Alphard 3.5 Executive Lounge", years: Array.from({ length: 2025 - 2015 + 1 }, (_, i) => 2015 + i), marketValue: 420000, engineCapacity: 3500 },

  // Toyota Avanza
  { make: "Toyota", model: "Avanza 1.3E", years: Array.from({ length: 2020 - 2004 + 1 }, (_, i) => 2004 + i), marketValue: 50000, engineCapacity: 1300 },
  { make: "Toyota", model: "Avanza 1.5S", years: Array.from({ length: 2020 - 2004 + 1 }, (_, i) => 2004 + i), marketValue: 60000, engineCapacity: 1500 },
  { make: "Toyota", model: "Avanza 1.5G", years: Array.from({ length: 2020 - 2004 + 1 }, (_, i) => 2004 + i), marketValue: 65000, engineCapacity: 1500 },

  // Toyota Rush
  { make: "Toyota", model: "Rush 1.5G", years: Array.from({ length: 2025 - 2008 + 1 }, (_, i) => 2008 + i), marketValue: 90000, engineCapacity: 1500 },
  { make: "Toyota", model: "Rush 1.5S", years: Array.from({ length: 2025 - 2008 + 1 }, (_, i) => 2008 + i), marketValue: 95000, engineCapacity: 1500 },

  // Toyota Wish
  { make: "Toyota", model: "Wish 1.8E", years: Array.from({ length: 2017 - 2003 + 1 }, (_, i) => 2003 + i), marketValue: 75000, engineCapacity: 1800 },
  { make: "Toyota", model: "Wish 2.0S", years: Array.from({ length: 2017 - 2003 + 1 }, (_, i) => 2003 + i), marketValue: 90000, engineCapacity: 2000 },

  // Toyota Harrier
  { make: "Toyota", model: "Harrier 2.0T", years: Array.from({ length: 2025 - 2014 + 1 }, (_, i) => 2014 + i), marketValue: 250000, engineCapacity: 2000 },
  { make: "Toyota", model: "Harrier 2.5", years: Array.from({ length: 2017 - 2014 + 1 }, (_, i) => 2014 + i), marketValue: 240000, engineCapacity: 2500 },

  // Toyota Estima
  { make: "Toyota", model: "Estima 2.4 Aeras", years: Array.from({ length: 2019 - 2003 + 1 }, (_, i) => 2003 + i), marketValue: 160000, engineCapacity: 2400 },
  { make: "Toyota", model: "Estima 3.5V6", years: Array.from({ length: 2019 - 2006 + 1 }, (_, i) => 2006 + i), marketValue: 190000, engineCapacity: 3500 },

  //HONDA
  // Honda City
  { make: "Honda", model: "City 1.5S", years: Array.from({ length: 2025 - 2003 + 1 }, (_, i) => 2003 + i), marketValue: 65000, engineCapacity: 1500 },
  { make: "Honda", model: "City 1.5E", years: Array.from({ length: 2025 - 2003 + 1 }, (_, i) => 2003 + i), marketValue: 85000, engineCapacity: 1500 },
  { make: "Honda", model: "City 1.5V", years: Array.from({ length: 2025 - 2003 + 1 }, (_, i) => 2003 + i), marketValue: 89000, engineCapacity: 1500 },

  // Honda Civic
  { make: "Honda", model: "Civic 1.7", years: Array.from({ length: 2025 - 2001 + 1 }, (_, i) => 2001 + i), marketValue: 50000, engineCapacity: 1700 },
  { make: "Honda", model: "Civic 1.8S", years: Array.from({ length: 2025 - 2001 + 1 }, (_, i) => 2001 + i), marketValue: 140000, engineCapacity: 1800 },
  { make: "Honda", model: "Civic 2.0S", years: Array.from({ length: 2025 - 2001 + 1 }, (_, i) => 2001 + i), marketValue: 155000, engineCapacity: 2000 },
  { make: "Honda", model: "Civic 1.5TC", years: Array.from({ length: 2025 - 2016 + 1 }, (_, i) => 2016 + i), marketValue: 145000, engineCapacity: 1500 },
  { make: "Honda", model: "Civic 1.5TC-P", years: Array.from({ length: 2025 - 2016 + 1 }, (_, i) => 2016 + i), marketValue: 155000, engineCapacity: 1500 },

  // Honda Accord
  { make: "Honda", model: "Accord 2.0E", years: Array.from({ length: 2025 - 2003 + 1 }, (_, i) => 2003 + i), marketValue: 150000, engineCapacity: 2000 },
  { make: "Honda", model: "Accord 2.0V", years: Array.from({ length: 2025 - 2003 + 1 }, (_, i) => 2003 + i), marketValue: 160000, engineCapacity: 2000 },
  { make: "Honda", model: "Accord 2.4V", years: Array.from({ length: 2020 - 2003 + 1 }, (_, i) => 2003 + i), marketValue: 175000, engineCapacity: 2400 },

  // Honda HR-V
  { make: "Honda", model: "HR-V 1.5S", years: Array.from({ length: 2025 - 2015 + 1 }, (_, i) => 2015 + i), marketValue: 100000, engineCapacity: 1500 },
  { make: "Honda", model: "HR-V 1.5E", years: Array.from({ length: 2025 - 2015 + 1 }, (_, i) => 2015 + i), marketValue: 105000, engineCapacity: 1500 },
  { make: "Honda", model: "HR-V 1.5V", years: Array.from({ length: 2025 - 2015 + 1 }, (_, i) => 2015 + i), marketValue: 115000, engineCapacity: 1500 },

  // Honda CR-V
  { make: "Honda", model: "CR-V 2.0 2WD", years: Array.from({ length: 2025 - 2000 + 1 }, (_, i) => 2000 + i), marketValue: 165000, engineCapacity: 2000 },
  { make: "Honda", model: "CR-V 2.0 4WD", years: Array.from({ length: 2025 - 2000 + 1 }, (_, i) => 2000 + i), marketValue: 170000, engineCapacity: 2000 },
  { make: "Honda", model: "CR-V 2.4 4WD", years: Array.from({ length: 2020 - 2008 + 1 }, (_, i) => 2008 + i), marketValue: 180000, engineCapacity: 2400 },

  // Honda BR-V
  { make: "Honda", model: "BR-V 1.5E", years: Array.from({ length: 2025 - 2017 + 1 }, (_, i) => 2017 + i), marketValue: 88000, engineCapacity: 1500 },
  { make: "Honda", model: "BR-V 1.5V", years: Array.from({ length: 2025 - 2017 + 1 }, (_, i) => 2017 + i), marketValue: 93000, engineCapacity: 1500 },

  // Honda WR-V
  { make: "Honda", model: "WR-V 1.5S", years: Array.from({ length: 2025 - 2023 + 1 }, (_, i) => 2023 + i), marketValue: 90000, engineCapacity: 1500 },
  { make: "Honda", model: "WR-V 1.5E", years: Array.from({ length: 2025 - 2023 + 1 }, (_, i) => 2023 + i), marketValue: 93000, engineCapacity: 1500 },
  { make: "Honda", model: "WR-V 1.5V", years: Array.from({ length: 2025 - 2023 + 1 }, (_, i) => 2023 + i), marketValue: 96000, engineCapacity: 1500 },

  // Honda Jazz
  { make: "Honda", model: "Jazz 1.5S", years: Array.from({ length: 2020 - 2003 + 1 }, (_, i) => 2003 + i), marketValue: 70000, engineCapacity: 1500 },
  { make: "Honda", model: "Jazz 1.5E", years: Array.from({ length: 2020 - 2003 + 1 }, (_, i) => 2003 + i), marketValue: 73000, engineCapacity: 1500 },
  { make: "Honda", model: "Jazz 1.5V", years: Array.from({ length: 2020 - 2003 + 1 }, (_, i) => 2003 + i), marketValue: 76000, engineCapacity: 1500 },

  // Honda Stream
  { make: "Honda", model: "Stream 1.7", years: Array.from({ length: 2014 - 2003 + 1 }, (_, i) => 2003 + i), marketValue: 50000, engineCapacity: 1700 },
  { make: "Honda", model: "Stream 1.8", years: Array.from({ length: 2014 - 2003 + 1 }, (_, i) => 2003 + i), marketValue: 60000, engineCapacity: 1800 },

  // Honda Odyssey
  { make: "Honda", model: "Odyssey 2.4", years: Array.from({ length: 2020 - 2000 + 1 }, (_, i) => 2000 + i), marketValue: 160000, engineCapacity: 2400 },
  { make: "Honda", model: "Odyssey 3.5V6", years: Array.from({ length: 2014 - 2005 + 1 }, (_, i) => 2005 + i), marketValue: 180000, engineCapacity: 3500 },

  //PERODUA
  // Perodua Myvi
  { make: "Perodua", model: "Myvi 1.3G", years: Array.from({length: 2025 - 2005 + 1}, (_, i) => 2005 + i), marketValue: 50000, engineCapacity: 1300 },
  { make: "Perodua", model: "Myvi 1.5H", years: Array.from({length: 2025 - 2005 + 1}, (_, i) => 2005 + i), marketValue: 55000, engineCapacity: 1500 },

  // Perodua Axia
  { make: "Perodua", model: "Axia 1.0E", years: Array.from({ length: 2025 - 2014 + 1 }, (_, i) => 2014 + i), marketValue: 40000, engineCapacity: 1000 },
  { make: "Perodua", model: "Axia 1.0G", years: Array.from({ length: 2025 - 2014 + 1 }, (_, i) => 2014 + i), marketValue: 45000, engineCapacity: 1000 },
  { make: "Perodua", model: "Axia 1.0 Style", years: Array.from({ length: 2025 - 2017 + 1 }, (_, i) => 2017 + i), marketValue: 47000, engineCapacity: 1000 },

  // Perodua Ativa
  { make: "Perodua", model: "Ativa 1.0X", years: Array.from({ length: 2025 - 2021 + 1 }, (_, i) => 2021 + i), marketValue: 65000, engineCapacity: 1000 },
  { make: "Perodua", model: "Ativa 1.0H", years: Array.from({ length: 2025 - 2021 + 1 }, (_, i) => 2021 + i), marketValue: 67500, engineCapacity: 1000 },

  // Perodua Alza
  { make: "Perodua", model: "Alza 1.5", years: Array.from({ length: 2014 - 2009 + 1 }, (_, i) => 2009 + i), marketValue: 68500, engineCapacity: 1500 },

  // Perodua Aruz
  { make: "Perodua", model: "Aruz 1.5S", years: Array.from({ length: 2025 - 2019 + 1 }, (_, i) => 2019 + i), marketValue: 75000, engineCapacity: 1500 },
  { make: "Perodua", model: "Aruz 1.5AV", years: Array.from({ length: 2025 - 2019 + 1 }, (_, i) => 2019 + i), marketValue: 75500, engineCapacity: 1500 },

  // Perodua Viva
  { make: "Perodua", model: "Viva 1.0M", years: Array.from({ length: 2014 - 2007 + 1 }, (_, i) => 2007 + i), marketValue: 20000, engineCapacity: 1000 },
  { make: "Perodua", model: "Viva 1.0E", years: Array.from({ length: 2014 - 2007 + 1 }, (_, i) => 2007 + i), marketValue: 22000, engineCapacity: 1000 },

  //NISSAN
  // Nissan Almera
  { make: "Nissan", model: "Almera 1.5E", years: Array.from({ length: 2025 - 2012 + 1 }, (_, i) => 2012 + i), marketValue: 82000, engineCapacity: 1500 },
  { make: "Nissan", model: "Almera 1.5VL", years: Array.from({ length: 2025 - 2012 + 1 }, (_, i) => 2012 + i), marketValue: 90000, engineCapacity: 1500 },

  // Nissan Sentra
  { make: "Nissan", model: "Sentra 1.6E", years: Array.from({ length: 2013 - 2000 + 1 }, (_, i) => 2000 + i), marketValue: 105000, engineCapacity: 1600 },
  { make: "Nissan", model: "Sentra 1.8V", years: Array.from({ length: 2013 - 2000 + 1 }, (_, i) => 2000 + i), marketValue: 110000, engineCapacity: 1800 },

  // Nissan Serena
  { make: "Nissan", model: "Serena 2.0S", years: Array.from({ length: 2025 - 2005 + 1 }, (_, i) => 2005 + i), marketValue: 140000, engineCapacity: 2000 },
  { make: "Nissan", model: "Serena 2.0V", years: Array.from({ length: 2025 - 2013 + 1 }, (_, i) => 2013 + i), marketValue: 150000, engineCapacity: 2000 },

  // Nissan X-Trail
  { make: "Nissan", model: "X-Trail 2.0", years: Array.from({ length: 2015 - 2004 + 1 }, (_, i) => 2004 + i), marketValue: 126000, engineCapacity: 2000 },
  { make: "Nissan", model: "X-Trail 2.5V", years: Array.from({ length: 2025 - 2015 + 1 }, (_, i) => 2015 + i), marketValue: 140000, engineCapacity: 2500 },

  //MAZDA
  // Mazda 2
  { make: "Mazda", model: "2 1.3 Standard", years: Array.from({ length: 2013 - 2009 + 1 }, (_, i) => 2009 + i), marketValue: 65000, engineCapacity: 1300 },
  { make: "Mazda", model: "2 1.5 Sport", years: Array.from({ length: 2025 - 2013 + 1 }, (_, i) => 2013 + i), marketValue: 75000, engineCapacity: 1500 },

  // Mazda 3
  { make: "Mazda", model: "3 1.6", years: Array.from({ length: 2008 - 2004 + 1 }, (_, i) => 2004 + i), marketValue: 110000, engineCapacity: 1600 },
  { make: "Mazda", model: "3 1.8S", years: Array.from({ length: 2015 - 2009 + 1 }, (_, i) => 2009 + i), marketValue: 122000, engineCapacity: 1800 },
  { make: "Mazda", model: "3 2.0GL", years: Array.from({ length: 2025 - 2016 + 1 }, (_, i) => 2016 + i), marketValue: 135000, engineCapacity: 2000 },

  // Mazda 6
  { make: "Mazda", model: "6 2.0", years: Array.from({ length: 2008 - 2002 + 1 }, (_, i) => 2002 + i), marketValue: 150000, engineCapacity: 2000 },
  { make: "Mazda", model: "6 2.5", years: Array.from({ length: 2025 - 2009 + 1 }, (_, i) => 2009 + i), marketValue: 160000, engineCapacity: 2500 },

  // Mazda CX series
  { make: "Mazda", model: "CX-3 2.0", years: Array.from({ length: 2025 - 2015 + 1 }, (_, i) => 2015 + i), marketValue: 95000, engineCapacity: 2000 },
  { make: "Mazda", model: "CX-5 2.0", years: Array.from({ length: 2015 - 2012 + 1 }, (_, i) => 2012 + i), marketValue: 145000, engineCapacity: 2000 },
  { make: "Mazda", model: "CX-5 2.5", years: Array.from({ length: 2025 - 2016 + 1 }, (_, i) => 2016 + i), marketValue: 150000, engineCapacity: 2500 },
  { make: "Mazda", model: "CX-8 2.5", years: Array.from({ length: 2025 - 2019 + 1 }, (_, i) => 2019 + i), marketValue: 170000, engineCapacity: 2500 },
  { make: "Mazda", model: "CX-9 3.7", years: Array.from({ length: 2025 - 2006 + 1 }, (_, i) => 2006 + i), marketValue: 200000, engineCapacity: 3700 },

  //MITSUBISHI
  // Mitsubishi Attrage
  { make: "Mitsubishi", model: "Attrage 1.2GL", years: Array.from({ length: 2025 - 2013 + 1 }, (_, i) => 2013 + i), marketValue: 60000, engineCapacity: 1200 },
  { make: "Mitsubishi", model: "Attrage 1.2Premium", years: Array.from({ length: 2025 - 2013 + 1 }, (_, i) => 2013 + i), marketValue: 65000, engineCapacity: 1200 },

  // Mitsubishi Outlander
  { make: "Mitsubishi", model: "Outlander 2.0GL", years: Array.from({ length: 2015 - 2012 + 1 }, (_, i) => 2012 + i), marketValue: 170000, engineCapacity: 2000 },
  { make: "Mitsubishi", model: "Outlander 2.4V", years: Array.from({ length: 2025 - 2016 + 1 }, (_, i) => 2016 + i), marketValue: 180000, engineCapacity: 2400 },

  // Mitsubishi Pajero Sport
  { make: "Mitsubishi", model: "Pajero Sport 2.4D", years: Array.from({ length: 2015 - 2010 + 1 }, (_, i) => 2010 + i), marketValue: 190000, engineCapacity: 2400 },
  { make: "Mitsubishi", model: "Pajero Sport 2.5D", years: Array.from({ length: 2025 - 2016 + 1 }, (_, i) => 2016 + i), marketValue: 200000, engineCapacity: 2500 },

  // SUBARU
  //Subaru XV
  { make: "Subaru", model: "XV 2.0i", years: Array.from({ length: 2015 - 2012 + 1 }, (_, i) => 2012 + i), marketValue: 110000, engineCapacity: 2000 },
  { make: "Subaru", model: "XV 2.0i-Premium", years: Array.from({ length: 2025 - 2016 + 1 }, (_, i) => 2016 + i), marketValue: 120000, engineCapacity: 2000 },
  
  //Subaru Forester
  { make: "Subaru", model: "Forester 2.0X", years: Array.from({ length: 2015 - 2012 + 1 }, (_, i) => 2012 + i), marketValue: 185000, engineCapacity: 2000 },
  { make: "Subaru", model: "Forester 2.0XT", years: Array.from({ length: 2025 - 2016 + 1 }, (_, i) => 2016 + i), marketValue: 195000, engineCapacity: 2000 },
  
  //Surabu Outback
  { make: "Subaru", model: "Outback 2.5", years: Array.from({ length: 2015 - 2010 + 1 }, (_, i) => 2010 + i), marketValue: 200000, engineCapacity: 2500 },
  { make: "Subaru", model: "Outback 3.6", years: Array.from({ length: 2025 - 2016 + 1 }, (_, i) => 2016 + i), marketValue: 220000, engineCapacity: 3600 },

  //SUZUKI
  //Suzuki Swift
  { make: "Suzuki", model: "Swift 1.4GL", years: Array.from({ length: 2016 - 2010 + 1 }, (_, i) => 2010 + i), marketValue: 75000, engineCapacity: 1400 },
  { make: "Suzuki", model: "Swift 1.4Sport", years: Array.from({ length: 2016 - 2010 + 1 }, (_, i) => 2010 + i), marketValue: 80000, engineCapacity: 1400 },
  
  //Suzuki Vitara
  { make: "Suzuki", model: "Vitara 1.6GL", years: Array.from({ length: 2016 - 2010 + 1 }, (_, i) => 2010 + i), marketValue: 130000, engineCapacity: 1600 },
  { make: "Suzuki", model: "Vitara 1.6Premium", years: Array.from({ length: 2016 - 2010 + 1 }, (_, i) => 2010 + i), marketValue: 135000, engineCapacity: 1600 },
  
  //Suzuki Alto
  { make: "Suzuki", model: "Alto 1.0GL", years: Array.from({ length: 2016 - 2009 + 1 }, (_, i) => 2009 + i), marketValue: 25000, engineCapacity: 1000 },
  { make: "Suzuki", model: "Alto 1.0Premium", years: Array.from({ length: 2016 - 2009 + 1 }, (_, i) => 2009 + i), marketValue: 28000, engineCapacity: 1000 },

  //VOLKSWAGEN
  //Volkswagen Polo
  { make: "Volkswagen", model: "Polo 1.4", years: Array.from({ length: 2025 - 2010 + 1 }, (_, i) => 2010 + i), marketValue: 97000, engineCapacity: 1400 },
  { make: "Volkswagen", model: "Polo 1.6", years: Array.from({ length: 2025 - 2010 + 1 }, (_, i) => 2010 + i), marketValue: 105000, engineCapacity: 1600 },
  
  //Volkswagen Golf
  { make: "Volkswagen", model: "Golf 1.4", years: Array.from({ length: 2025 - 2000 + 1 }, (_, i) => 2000 + i), marketValue: 150000, engineCapacity: 1400 },
  { make: "Volkswagen", model: "Golf 1.6", years: Array.from({ length: 2025 - 2000 + 1 }, (_, i) => 2000 + i), marketValue: 160000, engineCapacity: 1600 },
  
  //Volkswagen Passat
  { make: "Volkswagen", model: "Passat 1.8T", years: Array.from({ length: 2025 - 2010 + 1 }, (_, i) => 2010 + i), marketValue: 190000, engineCapacity: 1800 },
  { make: "Volkswagen", model: "Passat 2.0T", years: Array.from({ length: 2025 - 2010 + 1 }, (_, i) => 2010 + i), marketValue: 200000, engineCapacity: 2000 },
  
  //Volkswagen Tiguan
  { make: "Volkswagen", model: "Tiguan 1.4T", years: Array.from({ length: 2025 - 2012 + 1 }, (_, i) => 2012 + i), marketValue: 205000, engineCapacity: 1400 },
  { make: "Volkswagen", model: "Tiguan 2.0T", years: Array.from({ length: 2025 - 2012 + 1 }, (_, i) => 2012 + i), marketValue: 215000, engineCapacity: 1800 },
  
  //Volkswagen Arteon
  { make: "Volkswagen", model: "Arteon 2.0", years: Array.from({ length: 2025 - 2019 + 1 }, (_, i) => 2019 + i), marketValue: 220000, engineCapacity: 2000 },

  //HYUNDAI
  //Hyundai Elantra
  { make: "Hyundai", model: "Elantra 1.6", years: Array.from({ length: 2025 - 2001 + 1 }, (_, i) => 2001 + i), marketValue: 100000, engineCapacity: 1600 },
  { make: "Hyundai", model: "Elantra 2.0", years: Array.from({ length: 2025 - 2001 + 1 }, (_, i) => 2001 + i), marketValue: 110000, engineCapacity: 2000 },
  
  //Hyundai Sonata
  { make: "Hyundai", model: "Sonata 2.0", years: Array.from({ length: 2025 - 2001 + 1 }, (_, i) => 2001 + i), marketValue: 135000, engineCapacity: 2000 },
  { make: "Hyundai", model: "Sonata 2.4", years: Array.from({ length: 2025 - 2001 + 1 }, (_, i) => 2001 + i), marketValue: 145000, engineCapacity: 2400 },
  
  //Hyundai Tucson
  { make: "Hyundai", model: "Tucson 2.0", years: Array.from({ length: 2025 - 2004 + 1 }, (_, i) => 2004 + i), marketValue: 125000, engineCapacity: 2000 },
  { make: "Hyundai", model: "Tucson 2.4", years: Array.from({ length: 2025 - 2004 + 1 }, (_, i) => 2004 + i), marketValue: 135000, engineCapacity: 2400 },
  
  //Hyundai Santra Fe
  { make: "Hyundai", model: "Santa Fe 2.2", years: Array.from({ length: 2025 - 2005 + 1 }, (_, i) => 2005 + i), marketValue: 180000, engineCapacity: 2200 },
  { make: "Hyundai", model: "Santa Fe 2.4", years: Array.from({ length: 2025 - 2005 + 1 }, (_, i) => 2005 + i), marketValue: 190000, engineCapacity: 2400 },
  
  //Hyundai Ioniq
  { make: "Hyundai", model: "Ioniq 1.6", years: Array.from({ length: 2025 - 2016 + 1 }, (_, i) => 2016 + i), marketValue: 120000, engineCapacity: 1600 },

  //KIA
  //Kia Picanto
  { make: "Kia", model: "Picanto 1.0", years: Array.from({ length: 2025 - 2010 + 1 }, (_, i) => 2010 + i), marketValue: 45000, engineCapacity: 1000 },
  { make: "Kia", model: "Picanto 1.2", years: Array.from({ length: 2025 - 2010 + 1 }, (_, i) => 2010 + i), marketValue: 50000, engineCapacity: 1200 },
  
  //Kia Cerato
  { make: "Kia", model: "Cerato 1.6", years: Array.from({ length: 2025 - 2004 + 1 }, (_, i) => 2004 + i), marketValue: 95000, engineCapacity: 1600 },
  { make: "Kia", model: "Cerato 2.0", years: Array.from({ length: 2025 - 2004 + 1 }, (_, i) => 2004 + i), marketValue: 105000, engineCapacity: 2000 },
  
  //Kia Optima
  { make: "Kia", model: "Optima 2.0", years: Array.from({ length: 2025 - 2004 + 1 }, (_, i) => 2004 + i), marketValue: 125000, engineCapacity: 2000 },
  { make: "Kia", model: "Optima 2.4", years: Array.from({ length: 2025 - 2004 + 1 }, (_, i) => 2004 + i), marketValue: 135000, engineCapacity: 2400 },
  
  //Kia Sportage
  { make: "Kia", model: "Sportage 2.0", years: Array.from({ length: 2025 - 2005 + 1 }, (_, i) => 2005 + i), marketValue: 120000, engineCapacity: 2000 },
  { make: "Kia", model: "Sportage 2.4", years: Array.from({ length: 2025 - 2005 + 1 }, (_, i) => 2005 + i), marketValue: 130000, engineCapacity: 2400 },
  
  //Kia Sorento
  { make: "Kia", model: "Sorento 2.4", years: Array.from({ length: 2025 - 2002 + 1 }, (_, i) => 2002 + i), marketValue: 150000, engineCapacity: 2400 },
  { make: "Kia", model: "Sorento 3.3 V6", years: Array.from({ length: 2025 - 2010 + 1 }, (_, i) => 2010 + i), marketValue: 180000, engineCapacity: 3300 },
  
  //Kia Carnival
  { make: "Kia", model: "Carnival 2.2", years: Array.from({ length: 2025 - 2000 + 1 }, (_, i) => 2000 + i), marketValue: 160000, engineCapacity: 2200 },
  { make: "Kia", model: "Carnival 3.5 V6", years: Array.from({ length: 2025 - 2006 + 1 }, (_, i) => 2006 + i), marketValue: 220000, engineCapacity: 3500 },
  
  //Kia Stinger
  { make: "Kia", model: "Stinger 2.0T", years: Array.from({ length: 2025 - 2017 + 1 }, (_, i) => 2017 + i), marketValue: 240000, engineCapacity: 2000 },
  { make: "Kia", model: "Stinger 3.3 V6", years: Array.from({ length: 2025 - 2017 + 1 }, (_, i) => 2017 + i), marketValue: 280000, engineCapacity: 3300 },

  //MERCEDES-BENZ
  //Mercedes-Benz A-Class
  { make: "Mercedes-Benz", model: "A-Class A200", years: Array.from({ length: 2025 - 2019 + 1 }, (_, i) => 2019 + i), marketValue: 180000, engineCapacity: 1332 },
  { make: "Mercedes-Benz", model: "A-Class A250", years: Array.from({ length: 2025 - 2019 + 1 }, (_, i) => 2019 + i), marketValue: 200000, engineCapacity: 1991 },
  
  //Mercedes-Benz C-Class
  { make: "Mercedes-Benz", model: "C-Class C200", years: Array.from({ length: 2025 - 2015 + 1 }, (_, i) => 2015 + i), marketValue: 220000, engineCapacity: 1991 },
  { make: "Mercedes-Benz", model: "C-Class C250", years: Array.from({ length: 2025 - 2015 + 1 }, (_, i) => 2015 + i), marketValue: 240000, engineCapacity: 1991 },
  
  //Mercedes-Benz E-Class
  { make: "Mercedes-Benz", model: "E-Class E200", years: Array.from({ length: 2025 - 2015 + 1 }, (_, i) => 2015 + i), marketValue: 300000, engineCapacity: 1991 },
  { make: "Mercedes-Benz", model: "E-Class E250", years: Array.from({ length: 2025 - 2015 + 1 }, (_, i) => 2015 + i), marketValue: 320000, engineCapacity: 1991 },
  
  //Mercedes-Benz E-Class
  { make: "Mercedes-Benz", model: "S-Class S350", years: Array.from({ length: 2025 - 2014 + 1 }, (_, i) => 2014 + i), marketValue: 450000, engineCapacity: 2996 },
  { make: "Mercedes-Benz", model: "S-Class S450", years: Array.from({ length: 2025 - 2014 + 1 }, (_, i) => 2014 + i), marketValue: 500000, engineCapacity: 3996 },
  
  //Mercedes-Benz GLC
  { make: "Mercedes-Benz", model: "GLC 200", years: Array.from({ length: 2025 - 2016 + 1 }, (_, i) => 2016 + i), marketValue: 280000, engineCapacity: 1991 },
  { make: "Mercedes-Benz", model: "GLC 250", years: Array.from({ length: 2025 - 2016 + 1 }, (_, i) => 2016 + i), marketValue: 300000, engineCapacity: 1991 },
  
  //Mercedes-Benz GLA
  { make: "Mercedes-Benz", model: "GLA 250", years: Array.from({ length: 2025 - 2016 + 1 }, (_, i) => 2016 + i), marketValue: 220000, engineCapacity: 1991 },
  
  //Mercedes-Benz GLS
  { make: "Mercedes-Benz", model: "GLS 350", years: Array.from({ length: 2025 - 2016 + 1 }, (_, i) => 2016 + i), marketValue: 400000, engineCapacity: 2996 },
  { make: "Mercedes-Benz", model: "GLS 450", years: Array.from({ length: 2025 - 2016 + 1 }, (_, i) => 2016 + i), marketValue: 450000, engineCapacity: 3996 },

  //BMW
  //BMW 1
  { make: "BMW", model: "1 Series 118i", years: Array.from({ length: 2025 - 2014 + 1 }, (_, i) => 2014 + i), marketValue: 120000, engineCapacity: 1499 },
  { make: "BMW", model: "1 Series 120i", years: Array.from({ length: 2025 - 2014 + 1 }, (_, i) => 2014 + i), marketValue: 130000, engineCapacity: 1998 },
  
  //BMW 3
  { make: "BMW", model: "3 Series 320i", years: Array.from({ length: 2025 - 2015 + 1 }, (_, i) => 2015 + i), marketValue: 200000, engineCapacity: 1998 },
  { make: "BMW", model: "3 Series 330i", years: Array.from({ length: 2025 - 2015 + 1 }, (_, i) => 2015 + i), marketValue: 220000, engineCapacity: 2998 },
  
  //BMW 5
  { make: "BMW", model: "5 Series 520i", years: Array.from({ length: 2025 - 2015 + 1 }, (_, i) => 2015 + i), marketValue: 300000, engineCapacity: 1998 },
  { make: "BMW", model: "5 Series 530i", years: Array.from({ length: 2025 - 2015 + 1 }, (_, i) => 2015 + i), marketValue: 320000, engineCapacity: 2998 },
  
  //BMW 7
  { make: "BMW", model: "7 Series 730Li", years: Array.from({ length: 2025 - 2014 + 1 }, (_, i) => 2014 + i), marketValue: 450000, engineCapacity: 2998 },
  { make: "BMW", model: "7 Series 740Li", years: Array.from({ length: 2025 - 2014 + 1 }, (_, i) => 2014 + i), marketValue: 500000, engineCapacity: 3998 },
  
  //BMW X1
  { make: "BMW", model: "X1 sDrive18i", years: Array.from({ length: 2025 - 2016 + 1 }, (_, i) => 2016 + i), marketValue: 180000, engineCapacity: 1499 },
  { make: "BMW", model: "X1 sDrive20i", years: Array.from({ length: 2025 - 2016 + 1 }, (_, i) => 2016 + i), marketValue: 200000, engineCapacity: 1998 },
  
  //BMW X3
  { make: "BMW", model: "X3 xDrive20i", years: Array.from({ length: 2025 - 2015 + 1 }, (_, i) => 2015 + i), marketValue: 250000, engineCapacity: 1998 },
  { make: "BMW", model: "X3 xDrive30i", years: Array.from({ length: 2025 - 2015 + 1 }, (_, i) => 2015 + i), marketValue: 280000, engineCapacity: 2998 },
  
  //BMW X5
  { make: "BMW", model: "X5 xDrive35i", years: Array.from({ length: 2025 - 2015 + 1 }, (_, i) => 2015 + i), marketValue: 350000, engineCapacity: 2998 },
  
  //BMW X7
  { make: "BMW", model: "X7 xDrive40i", years: Array.from({ length: 2025 - 2019 + 1 }, (_, i) => 2019 + i), marketValue: 500000, engineCapacity: 2998 },

  //FORD
  //Ford Everest
  { make: "Ford", model: "Everest 2.2", years: Array.from({ length: 2025 - 2016 + 1 }, (_, i) => 2016 + i), marketValue: 140000, engineCapacity: 2200 },
  { make: "Ford", model: "Everest 3.2", years: Array.from({ length: 2025 - 2016 + 1 }, (_, i) => 2016 + i), marketValue: 160000, engineCapacity: 3200 },
  
  //Ford Focus
  { make: "Ford", model: "Focus 1.6", years: Array.from({ length: 2018 - 2012 + 1 }, (_, i) => 2012 + i), marketValue: 55000, engineCapacity: 1600 },
  { make: "Ford", model: "Focus 2.0", years: Array.from({ length: 2018 - 2012 + 1 }, (_, i) => 2012 + i), marketValue: 60000, engineCapacity: 2000 },
  
  //Ford Fiesta
  { make: "Ford", model: "Fiesta 1.0", years: Array.from({ length: 2019 - 2010 + 1 }, (_, i) => 2010 + i), marketValue: 30000, engineCapacity: 1000 },
  { make: "Ford", model: "Fiesta 1.5", years: Array.from({ length: 2019 - 2010 + 1 }, (_, i) => 2010 + i), marketValue: 35000, engineCapacity: 1500 },
  
  //Ford Mustang
  { make: "Ford", model: "Mustang 2.3", years: Array.from({ length: 2025 - 2016 + 1 }, (_, i) => 2016 + i), marketValue: 350000, engineCapacity: 2300 },
  { make: "Ford", model: "Mustang 5.0 V8", years: Array.from({ length: 2025 - 2016 + 1 }, (_, i) => 2016 + i), marketValue: 450000, engineCapacity: 5000 },

  //ISUZU mu-X
  { make: "Isuzu", model: "mu-X 1.9", years: Array.from({ length: 2025 - 2017 + 1 }, (_, i) => 2017 + i), marketValue: 120000, engineCapacity: 1900 },
  { make: "Isuzu", model: "mu-X 3.0", years: Array.from({ length: 2025 - 2017 + 1 }, (_, i) => 2017 + i), marketValue: 150000, engineCapacity: 3000 },

  //LEXUS
  //Lexus Is
  { make: "Lexus", model: "IS 200t", years: Array.from({ length: 2025 - 2010 + 1 }, (_, i) => 2010 + i), marketValue: 200000, engineCapacity: 2000 },
  { make: "Lexus", model: "IS 250", years: Array.from({ length: 2025 - 2010 + 1 }, (_, i) => 2010 + i), marketValue: 220000, engineCapacity: 2500 },
  
  //Lexus Es
  { make: "Lexus", model: "ES 250", years: Array.from({ length: 2025 - 2010 + 1 }, (_, i) => 2010 + i), marketValue: 250000, engineCapacity: 2500 },
  { make: "Lexus", model: "ES 350", years: Array.from({ length: 2025 - 2010 + 1 }, (_, i) => 2010 + i), marketValue: 280000, engineCapacity: 3500 },
  
  //Lexus Rx
  { make: "Lexus", model: "RX 300", years: Array.from({ length: 2025 - 2010 + 1 }, (_, i) => 2010 + i), marketValue: 300000, engineCapacity: 3000 },
  { make: "Lexus", model: "RX 350", years: Array.from({ length: 2025 - 2010 + 1 }, (_, i) => 2010 + i), marketValue: 320000, engineCapacity: 3500 },
  
  //Lexus Nx
  { make: "Lexus", model: "NX 200t", years: Array.from({ length: 2025 - 2015 + 1 }, (_, i) => 2015 + i), marketValue: 270000, engineCapacity: 2000 },
  
  //Lexus Ux
  { make: "Lexus", model: "UX 200", years: Array.from({ length: 2025 - 2019 + 1 }, (_, i) => 2019 + i), marketValue: 200000, engineCapacity: 2000 },

  //AUDI
  //Audi a3
  { make: "Audi", model: "A3 1.4 TFSI", years: Array.from({ length: 2025 - 2014 + 1 }, (_, i) => 2014 + i), marketValue: 160000, engineCapacity: 1400 },
  { make: "Audi", model: "A3 2.0 TFSI", years: Array.from({ length: 2025 - 2014 + 1 }, (_, i) => 2014 + i), marketValue: 180000, engineCapacity: 2000 },
  
  //Audi a4
  { make: "Audi", model: "A4 2.0 TFSI", years: Array.from({ length: 2025 - 2010 + 1 }, (_, i) => 2010 + i), marketValue: 190000, engineCapacity: 2000 },
  { make: "Audi", model: "A4 2.0 TDI", years: Array.from({ length: 2025 - 2010 + 1 }, (_, i) => 2010 + i), marketValue: 200000, engineCapacity: 2000 },
  
  //Audi a6
  { make: "Audi", model: "A6 2.0 TFSI", years: Array.from({ length: 2025 - 2010 + 1 }, (_, i) => 2010 + i), marketValue: 250000, engineCapacity: 2000 },
  { make: "Audi", model: "A6 3.0 TFSI", years: Array.from({ length: 2025 - 2010 + 1 }, (_, i) => 2010 + i), marketValue: 280000, engineCapacity: 3000 },
  
  //Audi q3
  { make: "Audi", model: "Q3 1.4 TFSI", years: Array.from({ length: 2025 - 2013 + 1 }, (_, i) => 2013 + i), marketValue: 170000, engineCapacity: 1400 },
  { make: "Audi", model: "Q3 2.0 TFSI", years: Array.from({ length: 2025 - 2013 + 1 }, (_, i) => 2013 + i), marketValue: 190000, engineCapacity: 2000 },
  
  //Audi q5
  { make: "Audi", model: "Q5 2.0 TFSI", years: Array.from({ length: 2025 - 2010 + 1 }, (_, i) => 2010 + i), marketValue: 250000, engineCapacity: 2000 },
  { make: "Audi", model: "Q5 3.0 TFSI", years: Array.from({ length: 2025 - 2010 + 1 }, (_, i) => 2010 + i), marketValue: 280000, engineCapacity: 3000 },
  
  //Audi q7
  { make: "Audi", model: "Q7 3.0 TFSI", years: Array.from({ length: 2025 - 2010 + 1 }, (_, i) => 2010 + i), marketValue: 350000, engineCapacity: 3000 },

  //PORSCHE
  //Porsche Macan
  { make: "Porsche", model: "Macan 2.0", years: Array.from({ length: 2025 - 2014 + 1 }, (_, i) => 2014 + i), marketValue: 380000, engineCapacity: 2000 },
  { make: "Porsche", model: "Macan S", years: Array.from({ length: 2025 - 2014 + 1 }, (_, i) => 2014 + i), marketValue: 450000, engineCapacity: 3000 },
  
  //Porsche Cayenne
  { make: "Porsche", model: "Cayenne 3.0 V6", years: Array.from({ length: 2025 - 2010 + 1 }, (_, i) => 2010 + i), marketValue: 500000, engineCapacity: 3000 },
  { make: "Porsche", model: "Cayenne 4.2 V8", years: Array.from({ length: 2025 - 2010 + 1 }, (_, i) => 2010 + i), marketValue: 650000, engineCapacity: 4200 },
  
  //Porsche Panamera
  { make: "Porsche", model: "Panamera 3.0", years: Array.from({ length: 2025 - 2010 + 1 }, (_, i) => 2010 + i), marketValue: 600000, engineCapacity: 3000 },
  { make: "Porsche", model: "Panamera 4S", years: Array.from({ length: 2025 - 2010 + 1 }, (_, i) => 2010 + i), marketValue: 750000, engineCapacity: 4000 },
  
  //Porsche Carrera
  { make: "Porsche", model: "911 Carrera", years: Array.from({ length: 2025 - 2000 + 1 }, (_, i) => 2000 + i), marketValue: 900000, engineCapacity: 3000 },
  { make: "Porsche", model: "911 Turbo", years: Array.from({ length: 2025 - 2000 + 1 }, (_, i) => 2000 + i), marketValue: 1200000, engineCapacity: 3800 },

  // Volvo
  { make: "Volvo", model: "S60 T4", years: Array.from({ length: 2025 - 2011 + 1 }, (_, i) => 2011 + i), marketValue: 200000, engineCapacity: 2000 },
  { make: "Volvo", model: "S60 T5", years: Array.from({ length: 2025 - 2011 + 1 }, (_, i) => 2011 + i), marketValue: 220000, engineCapacity: 2500 },
  
  { make: "Volvo", model: "S90 T5", years: Array.from({ length: 2025 - 2017 + 1 }, (_, i) => 2017 + i), marketValue: 300000, engineCapacity: 2000 },
  { make: "Volvo", model: "S90 T6", years: Array.from({ length: 2025 - 2017 + 1 }, (_, i) => 2017 + i), marketValue: 320000, engineCapacity: 2500 },
  
  { make: "Volvo", model: "XC40 T3", years: Array.from({ length: 2025 - 2018 + 1 }, (_, i) => 2018 + i), marketValue: 220000, engineCapacity: 2000 },
  { make: "Volvo", model: "XC40 T5", years: Array.from({ length: 2025 - 2018 + 1 }, (_, i) => 2018 + i), marketValue: 250000, engineCapacity: 2500 },
  
  { make: "Volvo", model: "XC60 T5", years: Array.from({ length: 2025 - 2011 + 1 }, (_, i) => 2011 + i), marketValue: 260000, engineCapacity: 2000 },
  { make: "Volvo", model: "XC60 T6", years: Array.from({ length: 2025 - 2011 + 1 }, (_, i) => 2011 + i), marketValue: 300000, engineCapacity: 2500 },
  
  { make: "Volvo", model: "XC90 T5", years: Array.from({ length: 2025 - 2015 + 1 }, (_, i) => 2015 + i), marketValue: 350000, engineCapacity: 2000 },
  { make: "Volvo", model: "XC90 T6", years: Array.from({ length: 2025 - 2015 + 1 }, (_, i) => 2015 + i), marketValue: 380000, engineCapacity: 2500 },

  // Peugeot
  { make: "Peugeot", model: "208 1.2 Active", years: Array.from({ length: 2025 - 2013 + 1 }, (_, i) => 2013 + i), marketValue: 65000, engineCapacity: 1200 },
  { make: "Peugeot", model: "208 1.2 Allure", years: Array.from({ length: 2025 - 2013 + 1 }, (_, i) => 2013 + i), marketValue: 70000, engineCapacity: 1200 },
  
  { make: "Peugeot", model: "3008 1.6 Turbo", years: Array.from({ length: 2025 - 2010 + 1 }, (_, i) => 2010 + i), marketValue: 120000, engineCapacity: 1600 },
  { make: "Peugeot", model: "3008 2.0 GT", years: Array.from({ length: 2025 - 2010 + 1 }, (_, i) => 2010 + i), marketValue: 140000, engineCapacity: 2000 },
  
  { make: "Peugeot", model: "5008 1.6 Turbo", years: Array.from({ length: 2025 - 2012 + 1 }, (_, i) => 2012 + i), marketValue: 135000, engineCapacity: 1600 },
  { make: "Peugeot", model: "5008 2.0 GT", years: Array.from({ length: 2025 - 2012 + 1 }, (_, i) => 2012 + i), marketValue: 150000, engineCapacity: 2000 },

  // Renault
  { make: "Renault", model: "Koleos 2.0", years: Array.from({ length: 2025 - 2010 + 1 }, (_, i) => 2010 + i), marketValue: 125000, engineCapacity: 2000 },
  { make: "Renault", model: "Koleos 2.5", years: Array.from({ length: 2025 - 2010 + 1 }, (_, i) => 2010 + i), marketValue: 140000, engineCapacity: 2500 },
  
  { make: "Renault", model: "Captur 1.2 Turbo", years: Array.from({ length: 2025 - 2015 + 1 }, (_, i) => 2015 + i), marketValue: 85000, engineCapacity: 1200 },
  { make: "Renault", model: "Captur 1.5 DCI", years: Array.from({ length: 2025 - 2015 + 1 }, (_, i) => 2015 + i), marketValue: 95000, engineCapacity: 1500 },
  
  { make: "Renault", model: "Megane 1.6", years: Array.from({ length: 2019 - 2010 + 1 }, (_, i) => 2010 + i), marketValue: 65000, engineCapacity: 1600 },
  { make: "Renault", model: "Megane 2.0", years: Array.from({ length: 2019 - 2010 + 1 }, (_, i) => 2010 + i), marketValue: 75000, engineCapacity: 2000 },

  // Mini
  { make: "Mini", model: "Cooper 1.5", years: Array.from({ length: 2025 - 2010 + 1 }, (_, i) => 2010 + i), marketValue: 150000, engineCapacity: 1500 },
  { make: "Mini", model: "Cooper S 2.0", years: Array.from({ length: 2025 - 2010 + 1 }, (_, i) => 2010 + i), marketValue: 180000, engineCapacity: 2000 },
  
  { make: "Mini", model: "Clubman 1.5", years: Array.from({ length: 2025 - 2010 + 1 }, (_, i) => 2010 + i), marketValue: 160000, engineCapacity: 1500 },
  { make: "Mini", model: "Clubman Cooper S 2.0", years: Array.from({ length: 2025 - 2010 + 1 }, (_, i) => 2010 + i), marketValue: 190000, engineCapacity: 2000 },
  
  { make: "Mini", model: "Countryman 1.5", years: Array.from({ length: 2025 - 2012 + 1 }, (_, i) => 2012 + i), marketValue: 180000, engineCapacity: 1500 },
  { make: "Mini", model: "Countryman Cooper S 2.0", years: Array.from({ length: 2025 - 2012 + 1 }, (_, i) => 2012 + i), marketValue: 210000, engineCapacity: 2000 },

  // Jeep
  { make: "Jeep", model: "Wrangler 2.0", years: Array.from({ length: 2025 - 2012 + 1 }, (_, i) => 2012 + i), marketValue: 280000, engineCapacity: 2000 },
  { make: "Jeep", model: "Wrangler 3.6", years: Array.from({ length: 2025 - 2012 + 1 }, (_, i) => 2012 + i), marketValue: 350000, engineCapacity: 3600 },
  
  { make: "Jeep", model: "Compass 1.4", years: Array.from({ length: 2025 - 2018 + 1 }, (_, i) => 2018 + i), marketValue: 190000, engineCapacity: 1400 },
  { make: "Jeep", model: "Compass 2.0", years: Array.from({ length: 2025 - 2018 + 1 }, (_, i) => 2018 + i), marketValue: 220000, engineCapacity: 2000 },
  
  { make: "Jeep", model: "Cherokee 2.4", years: Array.from({ length: 2025 - 2014 + 1 }, (_, i) => 2014 + i), marketValue: 220000, engineCapacity: 2400 },
  { make: "Jeep", model: "Cherokee 3.2", years: Array.from({ length: 2025 - 2014 + 1 }, (_, i) => 2014 + i), marketValue: 270000, engineCapacity: 3200 },
  
  { make: "Jeep", model: "Grand Cherokee 3.0", years: Array.from({ length: 2025 - 2012 + 1 }, (_, i) => 2012 + i), marketValue: 320000, engineCapacity: 3000 },
  { make: "Jeep", model: "Grand Cherokee 3.6", years: Array.from({ length: 2025 - 2012 + 1 }, (_, i) => 2012 + i), marketValue: 380000, engineCapacity: 3600 },

  // SsangYong
  { make: "SsangYong", model: "Tivoli 1.5", years: Array.from({ length: 2025 - 2016 + 1 }, (_, i) => 2016 + i), marketValue: 90000, engineCapacity: 1500 },
  { make: "SsangYong", model: "Tivoli 1.6", years: Array.from({ length: 2025 - 2016 + 1 }, (_, i) => 2016 + i), marketValue: 95000, engineCapacity: 1600 },
  
  { make: "SsangYong", model: "Korando 1.6", years: Array.from({ length: 2025 - 2015 + 1 }, (_, i) => 2015 + i), marketValue: 120000, engineCapacity: 1600 },
  { make: "SsangYong", model: "Korando 2.0", years: Array.from({ length: 2025 - 2015 + 1 }, (_, i) => 2015 + i), marketValue: 135000, engineCapacity: 2000 },
  
  { make: "SsangYong", model: "Rexton 2.0", years: Array.from({ length: 2025 - 2018 + 1 }, (_, i) => 2018 + i), marketValue: 180000, engineCapacity: 2000 },
  { make: "SsangYong", model: "Rexton 2.2", years: Array.from({ length: 2025 - 2018 + 1 }, (_, i) => 2018 + i), marketValue: 200000, engineCapacity: 2200 },

  // MG
  { make: "MG", model: "ZS 1.5", years: Array.from({ length: 2025 - 2021 + 1 }, (_, i) => 2021 + i), marketValue: 95000, engineCapacity: 1500 },
  { make: "MG", model: "ZS 1.5T", years: Array.from({ length: 2025 - 2021 + 1 }, (_, i) => 2021 + i), marketValue: 105000, engineCapacity: 1500 },
  
  { make: "MG", model: "HS 1.5", years: Array.from({ length: 2025 - 2021 + 1 }, (_, i) => 2021 + i), marketValue: 125000, engineCapacity: 1500 },
  { make: "MG", model: "HS 2.0", years: Array.from({ length: 2025 - 2021 + 1 }, (_, i) => 2021 + i), marketValue: 140000, engineCapacity: 2000 },

  // Land Rover
  { make: "Land Rover", model: "Discovery Sport 2.0", years: Array.from({ length: 2025 - 2015 + 1 }, (_, i) => 2015 + i), marketValue: 250000, engineCapacity: 2000 },
  { make: "Land Rover", model: "Discovery Sport 2.0 TD", years: Array.from({ length: 2025 - 2015 + 1 }, (_, i) => 2015 + i), marketValue: 270000, engineCapacity: 2000 },
  
  { make: "Land Rover", model: "Range Rover Evoque 2.0", years: Array.from({ length: 2025 - 2015 + 1 }, (_, i) => 2015 + i), marketValue: 300000, engineCapacity: 2000 },
  { make: "Land Rover", model: "Range Rover Evoque 2.0 TD", years: Array.from({ length: 2025 - 2015 + 1 }, (_, i) => 2015 + i), marketValue: 320000, engineCapacity: 2000 },
  
  { make: "Land Rover", model: "Defender 2.0", years: Array.from({ length: 2025 - 2021 + 1 }, (_, i) => 2021 + i), marketValue: 450000, engineCapacity: 2000 },
  { make: "Land Rover", model: "Defender 3.0", years: Array.from({ length: 2025 - 2021 + 1 }, (_, i) => 2021 + i), marketValue: 500000, engineCapacity: 3000 },
  
  { make: "Land Rover", model: "Range Rover Velar 2.0", years: Array.from({ length: 2025 - 2018 + 1 }, (_, i) => 2018 + i), marketValue: 420000, engineCapacity: 2000 },
  { make: "Land Rover", model: "Range Rover Velar 3.0", years: Array.from({ length: 2025 - 2018 + 1 }, (_, i) => 2018 + i), marketValue: 480000, engineCapacity: 3000 },

  // Jaguar
  { make: "Jaguar", model: "XF 2.0", years: Array.from({ length: 2025 - 2010 + 1 }, (_, i) => 2010 + i), marketValue: 250000, engineCapacity: 2000 },
  { make: "Jaguar", model: "XF 3.0 V6", years: Array.from({ length: 2025 - 2010 + 1 }, (_, i) => 2010 + i), marketValue: 320000, engineCapacity: 3000 },
  
  { make: "Jaguar", model: "XE 2.0", years: Array.from({ length: 2025 - 2015 + 1 }, (_, i) => 2015 + i), marketValue: 220000, engineCapacity: 2000 },
  { make: "Jaguar", model: "XE 3.0 V6", years: Array.from({ length: 2025 - 2015 + 1 }, (_, i) => 2015 + i), marketValue: 280000, engineCapacity: 3000 },
  
  { make: "Jaguar", model: "F-Pace 2.0", years: Array.from({ length: 2025 - 2017 + 1 }, (_, i) => 2017 + i), marketValue: 380000, engineCapacity: 2000 },
  { make: "Jaguar", model: "F-Pace 3.0 V6", years: Array.from({ length: 2025 - 2017 + 1 }, (_, i) => 2017 + i), marketValue: 450000, engineCapacity: 3000 },

  // Skoda
  { make: "Skoda", model: "Octavia 1.4", years: Array.from({ length: 2025 - 2023 + 1 }, (_, i) => 2023 + i), marketValue: 160000, engineCapacity: 1400 },
  { make: "Skoda", model: "Octavia 1.5", years: Array.from({ length: 2025 - 2023 + 1 }, (_, i) => 2023 + i), marketValue: 165000, engineCapacity: 1500 },
  
  { make: "Skoda", model: "Superb 2.0", years: Array.from({ length: 2025 - 2023 + 1 }, (_, i) => 2023 + i), marketValue: 220000, engineCapacity: 2000 },
  
  { make: "Skoda", model: "Kodiaq 2.0", years: Array.from({ length: 2025 - 2023 + 1 }, (_, i) => 2023 + i), marketValue: 230000, engineCapacity: 2000 },
  
  { make: "Skoda", model: "Kamiq 1.5", years: Array.from({ length: 2025 - 2023 + 1 }, (_, i) => 2023 + i), marketValue: 150000, engineCapacity: 1500 },

  // Alfa Romeo
  { make: "Alfa Romeo", model: "Giulia 2.0", years: Array.from({ length: 2025 - 2017 + 1 }, (_, i) => 2017 + i), marketValue: 320000, engineCapacity: 2000 },
  { make: "Alfa Romeo", model: "Giulia 2.9 V6", years: Array.from({ length: 2025 - 2017 + 1 }, (_, i) => 2017 + i), marketValue: 450000, engineCapacity: 2900 },
  
  { make: "Alfa Romeo", model: "Stelvio 2.0", years: Array.from({ length: 2025 - 2018 + 1 }, (_, i) => 2018 + i), marketValue: 350000, engineCapacity: 2000 },
  { make: "Alfa Romeo", model: "Stelvio 2.9 V6", years: Array.from({ length: 2025 - 2018 + 1 }, (_, i) => 2018 + i), marketValue: 480000, engineCapacity: 2900 },

];


