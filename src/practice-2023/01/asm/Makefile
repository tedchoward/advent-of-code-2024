day01.po: day01
	acx create -d day01.po --format ../../../../ProDOS_2_4_3.po --prodos --size=140kb
	acx import -d ./day01.po day01 --as

day01: main.o
	cl65 -t apple2enh -C apple2enh-asm.cfg -u __EXEHDR__ apple2enh.lib -o day01 -m day01.map -vm main.o

%.o : %.s
	ca65 --cpu 65c02 $<

.PHONY : clean
clean:
	-rm day01 day01.map *.o day01.po
