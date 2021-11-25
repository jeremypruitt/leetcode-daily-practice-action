# Create Leetcode Daily Practice Issue Action
automatic create daily practice issue for xingorg1/leetcodeRank


## usage
```yml
jobs:
  create_leetcode_daily_practice_issue:
    runs-on: ubuntu-latest
    name: create daily practice issue
    steps:
      - name: Checkout
        uses: actions/checkout@v2
      - name: create daily practice issue action step
        uses: xingorg1/leetcode-daily-practice-action@main
        with:
          token: ${{secrets.TOKEN}}
```
