	.macpack apple2
	.export	long_a, long_b, idx_a, idx_b
.struct OpenArgs
	param_count	.byte
	pathname	.word
	io_buffer	.word
	ref_num		.byte
.endstruct

.struct ReadArgs
	param_count	.byte
	ref_num		.byte
	data_buffer	.word
	request_count	.word
	trans_count	.word
.endstruct

.struct CloseArgs
	param_count	.byte
	ref_num		.byte
.endstruct

	.zeropage

	.word	$0000
ptr:	.word	$0000
long_a:	.byte	$00, $00, $00
long_b:	.byte	$00, $00, $00
idx_a:	.word	$0000
idx_b:	.word	$0000

	.data

open_args:
	.tag	OpenArgs

newline_args:
	.byte	$03		; param_count
newline_ref_num:
	.byte	$00		; ref_num
	.byte	$FF		; enable_mask
	.byte	$8D		; newline_char

read_args:
	.tag	ReadArgs

close_args:
	.tag	CloseArgs

	.code

	; System Calls
	HOME	= $FC58
	KEYIN	= $FD1B
	PRBYTE	= $FDDA
	COUT	= $FDED
	PRERR	= $FF2D
	PRODOS	= $BF00

	; ProDOS Calls
	QUIT	= $65
	OPEN	= $C8
	NEWLINE	= $C9
	READ	= $CA
	CLOSE	= $CC

	; Buffers
	io_buffer	= $1000
	read_buffer	= $1400
	list_a		= $1800
	list_b		= $2400

start:
	; initialize variables
	stz	ptr
	stz	ptr + 1
	stz	long_a
	stz	long_a + 1
	stz	long_a + 2
	stz	long_b
	stz	long_b + 1
	stz	long_b + 2
	lda	#<list_a
	sta	idx_a
	lda	#>list_a
	sta	idx_a + 1
	lda	#<list_b
	sta	idx_b
	lda	#>list_b
	sta	idx_b + 1

	; Start program
	jsr	HOME
	lda	#<hello_str
	ldx	#>hello_str
	jsr	print_string

	; open file
	lda	#<open_str
	ldx	#>open_str
	jsr	print_string

	lda	#$03
	sta	open_args + OpenArgs::param_count
	lda	#<file_path
	sta	open_args + OpenArgs::pathname
	lda	#>file_path
	sta	open_args + OpenArgs::pathname + 1
	stz	open_args + OpenArgs::io_buffer
	lda	#$10
	sta	open_args + OpenArgs::io_buffer + 1

	jsr	PRODOS
	.byte	OPEN
	.word	open_args
	beq	:+
	jmp	error
:
	; Set newline
	lda	open_args + OpenArgs::ref_num
	sta	newline_ref_num
	jsr	PRODOS
	.byte	NEWLINE
	.word	newline_args
	bne	error

	; Read one line into memory
	lda	#$04
	sta	read_args + ReadArgs::param_count
	lda	open_args + OpenArgs::ref_num
	sta	read_args + ReadArgs::ref_num
	lda	#<read_buffer
	sta	read_args + ReadArgs::data_buffer
	lda	#>read_buffer
	sta	read_args + ReadArgs::data_buffer + 1
	stz	read_args + ReadArgs::request_count
	lda	#$02
	sta	read_args + ReadArgs::request_count + 1

read_next_line:
	jsr	PRODOS
	.byte	READ
	.word	read_args
	bne	error

	stz	read_buffer+512
	lda	#<read_buffer
	ldx	#>read_buffer
	jsr	print_string

	ldy	#$00
	jsr	read_long

	; Add long_a to list_a
	jsr	add_to_list_a

	; advance read ptr
	dey
:	iny
	lda	read_buffer,Y
	cmp	#$A0
	beq	:-

	jsr	read_long

	jsr	add_to_list_b

	; TODO: sort the lists

	jmp	read_next_line

	;lda	long_a + 2
	;jsr	PRBYTE
	;lda	long_a + 1
	;jsr	PRBYTE
	;lda	long_a
	;jsr	PRBYTE
	;lda	#$8D
	;jsr	COUT
	;jsr	COUT

end_of_file:
	; Close File
	lda	#<close_str
	ldx	#>close_str
	jsr	print_string

	; close args
	lda	#$01
	sta	close_args + CloseArgs::param_count
	lda	open_args + OpenArgs::ref_num
	sta	close_args + CloseArgs::ref_num

	jsr	PRODOS
	.byte	CLOSE
	.word	close_args
	beq	end

error:
	cmp	#$4C		; End of File
	beq	end_of_file
	jsr	PRBYTE
	jsr	PRERR

end:
	brk
	lda	#<quit_str
	ldx	#>quit_str
	jsr	print_string

	jsr	KEYIN
	jsr	PRODOS
	.byte	QUIT
	.word	quit_args

; Reads the 24-bit integer at read_buffer,Y into long_a
;	modifies long_a, long_b
.proc read_long
	stz	long_a
	stz	long_a + 1
	stz	long_a + 2

next_digit:
	lda	read_buffer,Y
	cmp	#$AF
	bcc	notdigit
	;jsr	PRBYTE
	eor	#$B0			; map digits
	cmp	#$0A			; is it decimal?
	bcs	notdigit

	; long_a = long_a * 10 + A
	tax
	jsr	mul_10
	txa

	adc	long_a
	sta	long_a
	bcc	no_inc
	inc	long_a + 1
	beq	no_inc
	inc	long_a + 2
no_inc:

	iny
	bne	next_digit

notdigit:
	rts
.endproc

.proc	add_to_list_a
	lda	long_a
	sta	(idx_a)
	inc	idx_a
	bne	:+
	inc	idx_a + 1
:	lda	long_a + 1
	sta	(idx_a)
	inc	idx_a
	bne	:+
	inc	idx_a + 1
:	lda	long_a + 2
	sta	(idx_a)
	inc	idx_a
	bne	:+
	inc	idx_a + 1
:	rts
.endproc

.proc	add_to_list_b
	lda	long_a
	sta	(idx_b)
	inc	idx_b
	bne	:+
	inc	idx_b + 1
:	lda	long_a + 1
	sta	(idx_b)
	inc	idx_b
	bne	:+
	inc	idx_b + 1
:	lda	long_a + 2
	sta	(idx_b)
	inc	idx_b
	bne	:+
	inc	idx_b + 1
:	rts
.endproc


; Multiplies the 24-bit number in long_a by 10
; Stores the result in long_a
; long_a * 10 = long_a * 8 + long_a * 2 = long_a << 3 + long_a << 1
;	modifies A, long_a, long_b
.proc mul_10
	asl	long_a
	rol	long_a + 1
	rol	long_a + 2
	lda	long_a + 2
	sta	long_b + 2
	lda	long_a + 1
	sta	long_b + 1
	lda	long_a
.repeat 2
	asl	A
	rol	long_b + 1
	rol	long_b + 2
.endrepeat
	clc
	adc	long_a
	sta	long_a
	lda	long_b + 1
	adc	long_a + 1
	sta	long_a + 1
	lda	long_b + 2
	adc	long_a + 2
	sta	long_a + 2
	rts
.endproc

; Prints the NULL-terminated string at A,X
;	modifies A, Y, and ptr
.proc print_string
	sta	ptr
	stx	ptr+1
	ldy	#$00
next_char:
	lda	(ptr),Y
	beq	end
	jsr	COUT
	iny
	bne	next_char
end:	rts
.endproc

	.rodata
quit_args:
	.byte	$04		; number of paremeters
	.byte	$00		; quit type
	.byte	$00, $00	; reserved for future use
	.byte	$00		; reserved for future use
	.byte	$00, $00	; reserved for future use

file_path:
	.byte	.strlen("INPUT"), "INPUT"

hello_str:
	scrcode	"Ted was here!"
	.byte	$8D, $00

quit_str:
	.byte	$8D
	scrcode	"Press any key to continue..."
	.byte	$00

open_str:
	scrcode	"OPEN"
	.byte	$8D, $00

close_str:
	scrcode "CLOSE"
	.byte	$8D, $00
