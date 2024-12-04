day01.po: day01
	acx create -d day01.po -f ../../../ProDOS_2_4_3.po -n day01 --prodos --size=140kb
	acx delete -d ./day01.po BASIC.SYSTEM
	acx import -d ./day01.po day01 --as
	acx import -d ./day01.po /usr/local/share/cc65/target/apple2enh/util/loader.system -n day01.system -t=sys
	acx import -d ./day01.po ../input.txt -n input --text

day01: main.o
	cl65 -t apple2enh -C apple2enh-asm.cfg -u __EXEHDR__ apple2enh.lib -o day01 -m day01.map -vm main.o

%.o : %.s
	ca65 -t apple2enh $<

.PHONY : clean
clean:
	-rm day01 day01.map *.o day01.po
