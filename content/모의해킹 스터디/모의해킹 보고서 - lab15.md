---
publish: true
title: 모의해킹 보고서 - lab15
description: 익명으로 접근 가능했던 FTP와 그렇게 발견한 mdb(Microsoft database)파일로 계정 정보를 얻고 pst 메일 파일을 열어 Telnet 접속, cmdkey /list로 자격 증명 목록에서 Administrator 계정이 있음을 확인하여 runas /savecred로 관리자 권한으로 명령 실행이 가능해졌다.
created: 2026-11-09
modified: 2026-11-09T18:15:48.333Z
published: 2026-11-09
tags:
  - Windows
  - FTP
  - Anonymous
  - mdb
  - 7z
  - pst
  - mbox
  - telnet
  - cmdkey
  - runas
  - /savecred
  - certutil
  - base64
  - Guid
  - Masterkey
  - SID
  - DPAPI
  - impacket
date: 2026-11-09
lab: lab15
---

## 목차

1. [개요](#1-개요)
2. [총평](#2-총평)
3. [정보 수집 대상](#3-정보-수집-대상)
4. [진단결과 요약](#4-진단결과-요약)
5. [모의해킹 수행 내용](#5-모의해킹-수행-내용)
6. [취약점](#6-취약점)

## 1. 개요

본 보고서는 2026년 11월 9일에 진행된 lab15에 대한 모의해킹 보고서이다.

## 2. 총평

이번 lab15 모의해킹에서는 익명으로 접근 가능한 FTP, 평문으로 노출되어 있는 중요 정보, 잘못된 권한 설정으로 인한 일반 계정에서 관리자 권한 명령 실행의 취약점 연계로 권한 상승이 가능했다. 이는 외부에서 시작된 침해가 서버 전체에 대한 통제권 확보로 확대될 수 있음을 보여준다.

보완을 위해 FTP는 Anonymous Authentication 설정을 끄고 필요한 계정만 허용, 공개 폴더만 연결해서 읽기 전용으로 설정, 노출된 파일은 삭제하고 비밀번호를 변경하고 계정 정보, 특히 비밀번호는 절대 메일에 적지 않고 데이터 베이스는 최소 접근 권한을 허용, 일반 계정에서는 `Administrator` 자격 증명을 지우고 필요한 권한만 부여해야 한다.

## 3. 정보 수집 대상

개인 실습 서버 lab15을 대상으로 취약점을 점검했다. 대상 서버 lab15의 IP는 자산 보호 차원에서 가려두었다.

## 4. 진단결과 요약

아래 표는 이번 모의해킹 과정에서 발견된 주요 취약점을 요약한 것이다. 각 취약점에 대한 자세한 설명 및 대응 방안은 본 보고서의 '취약점' 섹션에서 확인할 수 있다.

| 취약점 이름                              | 위험도 | 설명                                  | 대응방안                                                                                                   |
| :---------------------------------- | :-- | :---------------------------------- | :----------------------------------------------------------------------------------------------------- |
| 익명으로 접근 가능한 FTP                     | 최상  | 계정 정보 등의 탈취 가능                      | 1. Anonymous Authentication 설정을 끄고 필요한 계정만 허용<br>2. 공개 폴더만 연결해서 읽기 전용으로 설정<br>3. 노출된 파일은 삭제하고 비밀번호를 변경 |
| 평문으로 노출되어 있는 중요 정보                  | 최상  | 획득한 정보들로 서버에 침투 하면서 결국 telnet 접속 가능 | 1. 계정 정보, 특히 비밀번호는 절대 메일에 적지 않음<br>2. 데이터 베이스는 최소 접근 권한을 허용                                            |
| 잘못된 권한 설정으로 인한 일반 계정에서 관리자 권한 명령 실행 | 최상  | `access /administrator` 권한 탈취를 허용   | 일반 계정에서 `Administrator` 자격 증명을 지우고 필요한 권한만 부여한다.                                                       |

## 5. 모의해킹 수행 내용 

![[00. Setting/00. 첨부파일/Pasted image 20261109180703.png]]

대상 서버를 포트 스캔해보니 `FTP`, `Telnet`, `HTTP` 세 포트가 나온다.

![[00. Setting/00. 첨부파일/Pasted image 20261109181317.png]]

익명 계정 `anonymous:anonymous@example.com` 으로 `FTP` 접속이 됐다.

![[00. Setting/00. 첨부파일/Pasted image 20261109181232.png]]

`Engineer`와 `Backups` 폴더가 있고 그중 `Backups` 폴더를 들어가면 `backup.mdb` 파일이 있다.
\*mdb : Mricrosoft Access database file

![[00. Setting/00. 첨부파일/Pasted image 20261109181451.png]]

파일이 손상되지 않게 `binary`로 로컬 칼리에 받는다.

![[00. Setting/00. 첨부파일/Pasted image 20261109181548.png]]

database 파일 확인을 위해 `mdbtools`를 설치한다.

![[00. Setting/00. 첨부파일/Pasted image 20261109181831.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261109233515.png]]

database table들을 확인해보니 `유저 인증 (auth_user)` table이 있다.

![[00. Setting/00. 첨부파일/Pasted image 20261109181909.png]]

내용을 확인해보면 `engineer`의 비밀번호가 평문으로 들어있다. `access4u@security`
`engineer`라면 아까 `Backups` 폴더와 함께 있음을 확인했었다.

![[00. Setting/00. 첨부파일/Pasted image 20261109182507.png]]

`Engineer` 폴더에 `Access Control.zip` 파일이 있다. 확인을 위해 칼리에 다운 받는다.

![[00. Setting/00. 첨부파일/Pasted image 20261109182543.png]]

`Access Control.zip` 안에 `Access Control.pst` 파일이 있다. AES 암호화가 된 zip 파일이라 `unzip`으로 풀리지 않는다. _압축 방식 99를 지원하지 않음_
\*pst : Microsoft Outlook 메일 보관 파일

![[00. Setting/00. 첨부파일/Pasted image 20261109234705.png]]

`unzip` 대신 `7z`로 풀고, 아까 획득한 `Engineer`의 비밀번호를 넣는다.

![[00. Setting/00. 첨부파일/Pasted image 20261109182743.png]]

압축이 풀렸다.

![[00. Setting/00. 첨부파일/Pasted image 20261109182938.png]]

`cat`으로 확인하니 바이너리로 뜬다.

![[00. Setting/00. 첨부파일/Pasted image 20261109182920.png]]

`strings`으로도 알아볼 수 있는 문구가 없다.

![[00. Setting/00. 첨부파일/Pasted image 20261109183002.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261109183154.png]]

`pst-utils`를 설치해서 mail 파일을 평문화한다.

![[00. Setting/00. 첨부파일/Pasted image 20261109183206.png]]

`Access Control.mbox`로 메일함이 생겼다.

![[00. Setting/00. 첨부파일/Pasted image 20261109183354.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261109183419.png]]

`security:4Cc3ssC0ntr0ller` 계정 정보 획득

![[00. Setting/00. 첨부파일/Pasted image 20261110014356.png]]

**telnet 접속 전에!!!!! 꼭!!!!!!! `stty erase '^H'` 를 하자!!!!
이거 안 하면 backspace가 안 된다!!!!!**

안 했다면 `Ctrl + H` . 잊지 말자....

![[00. Setting/00. 첨부파일/Pasted image 20261109183834.png]]

`Telnet`으로 접속, 획득한 계정 정보를 넣어 로그인한다.

![[00. Setting/00. 첨부파일/Pasted image 20261109183858.png]]

현재 사용자 정보를 확인해보면 `access\security` 로 나온다. 지금은 `Administrator`의 권한이 필요하다.

![[00. Setting/00. 첨부파일/Pasted image 20261110011200.png]]

public에 들어가보면 Desktop 폴더가 보이지 않는다.

![[00. Setting/00. 첨부파일/Pasted image 20261110011231.png]]

그런데 들어갈 수는 있다. 확인해보니 `ZAccess3.5 Security System.lnk`파일이 있다.
\*lnk : 바로가기 파일

![[00. Setting/00. 첨부파일/Pasted image 20261110011353.png]]

이렇게 `dir /s /b C:\Users\Public\*.lnk` 로도 확인 가능하다.

![[00. Setting/00. 첨부파일/Pasted image 20261110011947.png]]

`powershell -c "(New-Object -ComObject WScript.Shell).CreateShortcut('C:\Users\Public\Desktop\ZKAccess3.5 Security System.lnk').TargetPath` 로 어떤 바로가기 파일인지 확인할 수 있다. `runas.exe`를 실행하는 바로가기다.

일반 계정도 관리자 계정을 쓰기 편하려고 공용 바탕화면에 `runas.exe`를 실행하는 바로가기를 두었을 확률이 높다. 그렇다면 관리자 계정을 자격 증명에 저장했을 것이다.

![[00. Setting/00. 첨부파일/Pasted image 20261109190139.png]]

현재 사용자가 쓸 수 있는 자격 증명 목록을 `cmdkey /list`로 알 수 있다. `Administrator` 자격을 저장하고 있음을 보여준다.

![[00. Setting/00. 첨부파일/Pasted image 20261109190158.png]]

저장된 `Administrator`의 권한으로 `runas` 로 `whoami` 명령을 실행해본다. 아무것도 나오지 않는다. 확인이 가능한 경로에 txt 파일로 결과를 리다이렉트해서 확인해본다.\
`access\administrator` 으로 명령 실행을 하고 있음을 확인했다.

![[00. Setting/00. 첨부파일/Pasted image 20261109190403.png]]

`Administrator`의 폴더에 접근이 가능함이 확인 되었고 권한 상승에 성공했다.

## 6. 취약점

```
CVSS v4.0 점수: 10 / Critical
Macro vector: 000100
Exploitability: High
Complexity: High
Vulnerable system: High
Subsequent system: Medium
Exploitation: High
Security requirements: High
```

### 6.1  익명으로 접근 가능한 FTP

  **6.1.1 설명**

- 익명으로 FTP에 접근할 수 있었다.
- 계정 정보 등의 탈취가 가능했다

  **6.1.2 조치방법**

- Anonymous Authentication 설정을 끄고 필요한 계정만 허용한다.
- 공개 폴더만 연결해서 읽기 전용으로 설정한다.
- 노출된 파일은 삭제하고 비밀번호를 변경한다.

### 6.2  평문으로 노출되어 있는 중요 정보

  **6.2.1 설명**

- 데이터베이스, 메일 파일 등에 계정 정보들이 평문으로 노출되어 있다.
- 획득한 정보들로 서버에 침투 하면서 결국 telnet 접속이 가능했다.

  **6.2.2 조치방법**

- 계정 정보, 특히 비밀번호는 절대 메일에 적지 않도록 하고 데이터 베이스는 최소 접근 권한을 허용한다.

### 6.3  잘못된 권한 설정으로 인한 일반 계정에서 관리자 권한 명령 실행

  **6.3.1 설명**

- 일반 계정에서 `cmdkey /list`로 확인했을 때 `Administraotr`가 리스트에 있었고, `runas /savecred`로 사용이 가능했다.
- `access /administrator` 권한 탈취를 허용했다.

  **6.3.2 조치방법**

- 일반 계정에서 `Administrator` 자격 증명을 지우고 필요한 권한만 부여한다.

## +) `ACCESS\Administrator`의 비밀번호 찾기

![[00. Setting/00. 첨부파일/Pasted image 20261110013719.png]]

현재 `security` 계정임을 확인 후, `security` 계정에 `Administrator`의 자격 증명이 있으니, 자격 증명이 저장된 파일을 찾는다.
`dir /a C:\Users\security\AppData\Roaming\Microsoft\Credentials`

`51AB168BE4BDB3A603DADE4F8CA81290` 파일이 보인다.

![[00. Setting/00. 첨부파일/Pasted image 20261110015043.png]]

`certutil -encode "C:\Users\security\AppData\Roaming\Microsoft\Credentials\51AB168BE4BDB3A603DADE4F8CA81290" "C:\Users\security\Desktop\cred.txt"`
Credentials에 있는 파일을 사용자 계정 Desktop으로 가져온다.

![[00. Setting/00. 첨부파일/Pasted image 20261110015620.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261110015843.png]]

`cred.txt` 파일 확인, 헤더와 푸터를 제외한 본문만 복사해서 kali로 가져온다.

![[00. Setting/00. 첨부파일/Pasted image 20261110020436.png]]

디코딩하고 binary 파일로 다시 저장.

![[00. Setting/00. 첨부파일/Pasted image 20261110020450.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261110020510.png]]

크기가 같다 = 내용이 같은 파일임을 확인했다.

![[00. Setting/00. 첨부파일/Pasted image 20261110021328.png]]

`impacket-dpapi` 으로 credential 파일을 읽었고 `Guid Masterkey` 를 확인했다.
\*Guid: 특정 DPAPI 마스터키 파일을 구분하는 고유 ID.

![[00. Setting/00. 첨부파일/Pasted image 20261110022219.png]]

`dir /a "C:\Users\security\AppData\Roaming\Microsoft\Protect\` 로 SID 폴더 확인.

\*SID: Windows 계정의 고유 식별자
\*CREDHIST: 사용자가 비밀번호를 변경했을 때 이전 비밀번호와 연결된 DPAPI 키 정보를 보관하는 파일

![[00. Setting/00. 첨부파일/Pasted image 20261110022617.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261110022452.png]]

폴더 안에 Guid Masterkey와 이름이 같은 파일이 있다.

![[00. Setting/00. 첨부파일/Pasted image 20261110023224.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261110023551.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261110023729.png]]

다시 반복해서 binary 파일까지 만들어주기 (꼭 크기 확인)

![[00. Setting/00. 첨부파일/Pasted image 20261110023959.png]]

impacket-dpapi masterkey는 credential과 달리 SID와 password를 넣어서 파일을 읽는다. 그래야 복호화가 된다.

![[00. Setting/00. 첨부파일/Pasted image 20261110024711.png]]

credential.bin을 복호화된 키를 넣어 읽어주면 계정과 비밀번호가 뜬다.

![[00. Setting/00. 첨부파일/Pasted image 20261110025126.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261110025219.png]]

`Telnet` 으로 관리자 접속이 가능하고 현재 관리자 계정임을 확인했다.
