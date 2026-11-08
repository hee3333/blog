---
publish: true
title: 모의해킹 보고서 - lab03
description: 계정 없이 접근할 수 있는 SMB에서 찾은 SSH키를 ssh2john으로 해시화, john으로 크랙킹. SSH 원격접속, kdbx 파일을 찾아 keepass2john으로 해시화, john으로 크랙킹. keepass 접속해서 root 비밀번호 탈취, 원격 접속 성공.
created: 2026-10-17
modified: 2026-11-08T14:05:05.631Z
published: 2026-10-17
tags:
  - Linux
  - SMB
  - SSH
  - ssh2jhon
  - kdbx
  - KeePass
  - scp
  - keepass2jhon
  - passphrase
  - john
date: 2026-10-17
lab: lab03
---

## 목차

1. [개요](#1-개요)
2. [총평](#2-총평)
3. [정보 수집 대상](#3-정보-수집-대상)
4. [진단결과 요약](#4-진단결과-요약)
5. [모의해킹 수행 내용](#5-모의해킹-수행-내용)
6. [취약점](#6-취약점)

## 1. 개요

본 보고서는 2026년 10월 17일에 진행된 lab03에 대한 모의 해킹 보고서이다.

## 2. 총평

이번 lab03 모의해킹에서는 Samba 공유 폴더의 비인증 접근 허용, SSH 개인키의 과한 접근 권한으로 인한 노출, 복호화가 쉬운 passphrase로 보호된 접근 권한이 낮은 vault 파일로 인한 취약점 연계로 포트 스캔을 시작으로 samba 접근, 사용자 계정 원격 접속, vault 파일 접근에서 최종 root 권한 탈취까지 이어졌다. 이는 외부에서 시작된 침해가 서버 전체에 대한 통제권 확보로 확대될 수 있음을 보여준다.

보완을 위해 Samba 폴더의 비인증 접근을 막고 SSH 개인키와 vault 파일 권한을 강화해야 하며 자산 보호를 하는 passphrase를 길고 복잡하게 설정하고 추가 인증을 결합해야 한다.

## 3. 정보 수집 대상

개인 실습 서버 lab03을 대상으로 취약점을 점검했다. 대상 서버 lab03의 IP는 자산 보호 차원에서 가려두었다.

## 4. 진단결과 요약

아래 표는 이번 모의해킹 과정에서 발견된 주요 취약점을 요약한 것이다. 각 취약점에 대한 자세한 설명 및 대응 방안은 본 보고서의 '취약점'섹션에서 확인할 수 있다.

| 취약점 이름 | 위험도 | 설명 | 대응방안 |
| :--- | :---: | :--- | :--- |
| Samba 공유 폴더의 비인증/게스트 접근 허용 | 최상 | 공유 폴더에 인증 없는 사용자도 접근 가능하게 설정 | 접근 가능한 사용자 목록을 설정 |
| 접근 통제 미흡으로 인한 SSH 개인키 노출 | 최상 | samba로 접근했을 때 키를 게스트의 권한으로도 타 서버로 옮길 수 있음 | 노출된 키를 폐기, 교체<br>새로운 키에는 복호화가 어려운 암호와 최소 파일 접근 권한을 적용 |
| 복호화가 쉬운 Passphrase로 보호된, 접근이 쉬운 자산 | 최상 | vault의 passphrase가 쉽게 평문화 되었고 root의 암호가 쉽게 노출됨 | 파일의 권한을 최소화<br>passphrase를 길고 복잡하게 설정<br>추가 인증 결합  |

## 5. 모의해킹 수행 내용 

![[00. Setting/00. 첨부파일/Pasted image 20261108225939.png]]

주어진 서버 주소를 nmap으로 스캔해보니 21, 22, 111, 139, 445, 2049 6개가 뜬다.

![[00. Setting/00. 첨부파일/Pasted image 20261108225954.png]]

samba에 마운트 할 수 있는 목록을 찾아보니 samba-share가 있다.

![[00. Setting/00. 첨부파일/Pasted image 20261108230009.png]]

username을 모르니 공백으로 접근해본다.

![[00. Setting/00. 첨부파일/Pasted image 20261108230023.png]]

목록을 확인해보니 rsa키가 있다.

![[00. Setting/00. 첨부파일/Pasted image 20261108230036.png]]

로컬로 다운 받는다.

![[00. Setting/00. 첨부파일/Pasted image 20261108230049.png]]

확인해보면 SSH 개인키이다.

![[00. Setting/00. 첨부파일/Pasted image 20261108230110.png]]

실행 권한을 주고 파일 제목에 있는 이름을 계정으로 접속해본다.

![[00. Setting/00. 첨부파일/Pasted image 20261108230124.png]]

passphrase가 필요하다고 나온다.

![[00. Setting/00. 첨부파일/Pasted image 20261108230138.png]]

SSH 개인키를 해시 형식으로 변환해준다.

![[00. Setting/00. 첨부파일/Pasted image 20261108230158.png]]

평문화까지 진행한다. 비밀번호가 나왔다.

![[00. Setting/00. 첨부파일/Pasted image 20261108230211.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261108230216.png]]

SSH 일반 계정으로 접속 성공

![[00. Setting/00. 첨부파일/Pasted image 20261108230237.png]]

리스트를 확인해보니 kdbx 파일이 있다.\
kdbx는 KeePass 비밀번호 관리 프로그램의 데이터베이스 파일 형식. 해시화해서 평문화가 가능하다면 마스터 passphrase를 찾을 수 있다.

![[00. Setting/00. 첨부파일/Pasted image 20261108230251.png]]

접속한 서버는 keepass2john가 설치가 되어있지 않다. 로컬 서버로 파일을 복사해서 진행한다.

![[00. Setting/00. 첨부파일/Pasted image 20261108230300.png]]

keepass2john으로 해시화

![[00. Setting/00. 첨부파일/Pasted image 20261108230333.png]]

존으로 평문화하면 passphrase가 나온다.

![[00. Setting/00. 첨부파일/Pasted image 20261108230347.png]]

접속 가능.

![[00. Setting/00. 첨부파일/Pasted image 20261108230359.png]]

root의 암호가 있다.

![[00. Setting/00. 첨부파일/Pasted image 20261108230415.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261108230420.png]]

루트 접속 성공.

## 6. 취약점

```
CVSS v4.0 Score: 10 / Critical  
Macro vector: 000100  
Exploitability: High  
Complexity: High  
Vulnerable system: High  
Subsequent system: Medium  
Exploitation: High  
Security requirements: High
```

### 6.1 Samba 공유 폴더의 비인증/게스트 접근 허용

  **6.1.1 설명**

- 공유 폴더에 인증 없는 사용자도 접근 가능하게 설정했다.
- 폴더 내의 민감 정보 (SSH 개인키)가 노출 되었다.

  **6.1.2 조치방법**

- 서버의 `/etc/samba/smb.conf`에서 불필요한 접근은 차단하고 접근 가능한 사용자 목록을 설정한다.

### 6.2 접근 통제 미흡으로 인한 SSH 개인키 노출

  **6.2.1 설명**

- 개인키의 파일 권한을 최소 접근 권한으로 설정하지 않았다.
- samba로 접근했을 때 키를 게스트의 권한으로도 타 서버로 옮길 수 있다.

  **6.2.2 조치방법**

- 노출된 키를 폐기, 교체한다. 새로운 키에는 복호화가 어려운 암호와 최소 파일 접근 권한을 적용한다.

### 6.3 복호화가 쉬운 Passphrase로 보호된, 접근이 쉬운 자산

  **6.3.1 설명**

- vault 파일의 권한이 과하게 열려있고 passphrase가 자산 보호를 하기에 충분히 복잡하지 않았다.
- vault의 passphrase가 쉽게 평문화 되었고 root의 암호가 노출되었다.

  **6.3.2 조치방법**

- 파일의 권한을 최소화하고, passphrase를 길고 복잡하게 설정함에 더해 추가 인증 결합을 권고한다.
