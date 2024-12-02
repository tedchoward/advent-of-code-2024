day01: main.o
	ld65 -C ../../../liveoak-app.cfg -o day01 -m day01.map -vm main.o

%.o : %.s
	ca65 --cpu 6502 $<

.PHONY : clean
clean:
	-rm day01 day01.map *.o
