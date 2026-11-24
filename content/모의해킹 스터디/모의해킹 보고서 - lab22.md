---
publish: true
title: 모의해킹 보고서 - lab22
created: 2026-11-20
modified: 2026-11-24T14:30:00.955Z
published: 2026-11-20
date: 2026-11-20
tags:
description:
lab: lab22
---

## 목차

1. [개요](#1-개요)
2. [총평](#2-총평)
3. [정보 수집 대상](#3-정보-수집-대상)
4. [진단결과 요약](#4-진단결과-요약)
5. [모의해킹 수행 내용](#5-모의해킹-수행-내용)
6. [취약점](#6-취약점)

## 1. 개요

본 보고서는 2026년 11월 20일에 진행된 lab22에 대한 모의해킹 보고서이다.

## 2. 총평

이번 lab22 모의해킹에서는
이는 외부에서 시작된 침해가 서버 전체에 대한 통제권 확보로 확대될 수 있음을 보여준다.

보완을 위해

## 3. 정보 수집 대상

개인 실습 서버 lab22을 대상으로 취약점을 점검했다. 대상 서버 lab22의 IP는 자산 보호 차원에서 가려두었다.

## 4. 진단결과 요약

아래 표는 이번 모의해킹 과정에서 발견된 주요 취약점을 요약한 것이다. 각 취약점에 대한 자세한 설명 및 대응 방안은 본 보고서의 '취약점' 섹션에서 확인할 수 있다.

| 취약점 이름 | 위험도 | 설명  | 대응방안 |
| :----: | :-: | :-: | :--: |
|        |     |     |      |
|        |     |     |      |

## 5. 모의해킹 수행 내용 

![[00. Setting/00. 첨부파일/Pasted image 20261120090914.png]]

대상 서버의 포트를 스캔해보니 `SSH`, `SMB` 139, 445 포트가 나왔다.

![[00. Setting/00. 첨부파일/Pasted image 20261120091314.png]]

`SMB`의 공유 폴더를 열거해보니

```
HP-Reception
projects
transfer
```

세 개의 목록이 나왔다.

![[00. Setting/00. 첨부파일/Pasted image 20261120093308.png]]

익명으로 접속하려 했더니 연결이 안 된다.

![[00. Setting/00. 첨부파일/Pasted image 20261120093325.png]]

```
rpcclient -U '%' lab -c 'enumdomusers'
user:[scott] rid:[0x3e8]
```

사용자 정보를 알아보고자 익명 `rpcclient`로 사용자 조회를 해보니
`scott` 이 나왔다.

`rpcclient`: SMB를 통해 RPC 요청을 할 수 있다.
`enumdomusers`: enum + dom(ain) + users. 도메인 혹은 서버에 등록된 사용자 계정 목록을 요청하는 명령

![[00. Setting/00. 첨부파일/Pasted image 20261120093425.png]]

pw 정보는 찾지 못했다.

![[00. Setting/00. 첨부파일/Pasted image 20261120093528.png]]

공유 목록을 열거해봐도 딱히 보이는 게 없다.

![[00. Setting/00. 첨부파일/Pasted image 20261120093805.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261120093825.png]]

`smbmap`으로 공유 목록을 인증 없이 열거해보니 다 permission이 막혀 있다.

![[00. Setting/00. 첨부파일/Pasted image 20261120100510.png]]

`SMB` 취약점을 찾아보자. CVE-2026-4480 취약점을 찾았다. HP-Reception이 있었으니 취약점 공격이 가능할 것 같다.

![[00. Setting/00. 첨부파일/Pasted image 20261120101520.png]]

git clone으로 poc를 받고

![[00. Setting/00. 첨부파일/Pasted image 20261120102018.png]]

리버스 쉘을 열어주면

![[00. Setting/00. 첨부파일/Pasted image 20261120101937.png]]

열려있던 포트로 원격 접속이 되었다.

![[00. Setting/00. 첨부파일/Pasted image 20261120102155.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261120102137.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261120170718.png]]

`exploit.py` 실행으로 리버스쉘 명령어가 남아있다.

![[00. Setting/00. 첨부파일/Pasted image 20261120102603.png]]

사용자는 marcus와 scott이 있다.

![[00. Setting/00. 첨부파일/Pasted image 20261120102957.png]]

smb를 접속할 수 있는 인증 정보를 찾아야 한다. smb 관련 폴더를 찾아보자.

![[00. Setting/00. 첨부파일/Pasted image 20261120103131.png]]

smb 취약점인 print command %J를 확인할 수 있고, transfer에 read only =no wide links=yes가 있다. scott으로 smb를 접속할 수 있을 것 같다.

![[00. Setting/00. 첨부파일/Pasted image 20261120103606.png]]

/opt를 빠뜨림

![[00. Setting/00. 첨부파일/Pasted image 20261120104535.png]]

/opt에 offsite-backup 폴더가 있다.

![[00. Setting/00. 첨부파일/Pasted image 20261120104518.png]]

rclone.conf에 비밀번호 정보가 있다.

![[00. Setting/00. 첨부파일/Pasted image 20261120104722.png]]

이 정보를 평문화해보자.

iXzvcib3SrpZ

![[00. Setting/00. 첨부파일/Pasted image 20261120110911.png]]

su change로 scott으로 접속해본다. 성공했다.

![[00. Setting/00. 첨부파일/Pasted image 20261120111219.png]]

안정화 쉘로 만들어주고

![[00. Setting/00. 첨부파일/Pasted image 20261120111343.png]]

sudo -l 을 해도 scott은 아무런 권한이 없다.

![[00. Setting/00. 첨부파일/Pasted image 20261120112926.png]]

일단 smb 접속을 해본다. 성공했다. 폴더 안에 아무 것도 없다.

tranfer 폴더는 쓰기도 가능하고 wide links도 된다 했으니까 marcus의 사용자 폴더를 공유 폴더로 넣어서 ssh 키를 넣어준다.

![[00. Setting/00. 첨부파일/Pasted image 20261120112940.png]]

marcus 폴더 넣어주기

![[00. Setting/00. 첨부파일/Pasted image 20261120112954.png]]

marcus 폴더가 생겼다.

![[00. Setting/00. 첨부파일/Pasted image 20261120113547.png]]

marcus의 폴더에 .ssh 폴더를 만들어준다.

![[00. Setting/00. 첨부파일/Pasted image 20261120113517.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261120113655.png]]

ssh-keygen으로 SSH 키를 만든다.

![[00. Setting/00. 첨부파일/Pasted image 20261120113911.png]]

공용키를 authorized\_keys 로 이름을 변경해 marcus의 .ssh 폴더에 넣어준다.

![[00. Setting/00. 첨부파일/Pasted image 20261120114046.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261120114107.png]]

개인키를 이용해서 marcus 계정에 원격 접속한다. marcus는 operators 그룹에도 속해있다.

![[00. Setting/00. 첨부파일/Pasted image 20261120114314.png]]

system 경로에서 marcus에게 쓰기 권한이 있는 목록을 찾는다.

![[00. Setting/00. 첨부파일/Pasted image 20261120114446.png]]

smbd.service.d에 파일을 만들자.

![[00. Setting/00. 첨부파일/Pasted image 20261120114510.png]]

smb의 서비스 내용을 읽어본다.  `systemctl cat smbd`에는 기본 서비스 설정만 보인다. 현재 적용된 drop-in은 없지만 `operators` 그룹이 이 위치에 파일을 만들 수 있다.

![[00. Setting/00. 첨부파일/Pasted image 20261120115034.png]]

권한을 확인하기 위해 smbd를 재실행해본다. 에러 없이 재실행이 되는 걸 보니 실행 권한이 있다.

![[00. Setting/00. 첨부파일/Pasted image 20261120115452.png]]

touch를 실행해 파일이 루트 권한으로 만들어지나 확인해본다. root의 권한으로 파일이 생겼다.

![[00. Setting/00. 첨부파일/Pasted image 20261120133040.png]]

만들어 놓은 ssh의 공개키를 복사해서 키 파일을 만들고 권한을 준다.

![[00. Setting/00. 첨부파일/Pasted image 20261120133532.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261120133150.png]]

개인키로 root 권한 원격 접속에 성공했다.

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

### 6.1  

<br> **6.1.1 설명**

-

<br>; **6.1.2 조치방법**

-
