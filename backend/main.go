package main

import (
	"net/http"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"strconv"
)

type Todo struct {
	ID      uint   `gorm:"primaryKey" json:"id"`
	Task    string `json:"task"`
	Deleted bool   `json:"deleted"`
}

var db *gorm.DB

// 初期化
func initialDB() {
	var err error
	db, err = gorm.Open(postgres.Open("host=db user=user password=password dbname=todo port=5432 sslmode=disable"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	// DBがなければ自動生成
	db.AutoMigrate(&Todo{})
}

// Todo登録
func createTodo(c *gin.Context) {
	var todo Todo
	if err := c.ShouldBindJSON(&todo); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.Create(&todo)
	c.JSON(http.StatusAccepted, todo)
}

// Todo取得
func getTodo(c *gin.Context) {
	var todo []Todo
	// 削除済み(deleted = true)のデータを除外
	db.Where("deleted = ?", false).Find(&todo)
	c.JSON(http.StatusOK, todo)
}

// Todo削除(Deleted -> True)
func deleteTodo(c *gin.Context){
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var todo Todo
	if err := db.First(&todo, id).Error; err != nil{
		c.JSON(http.StatusNotFound, gin.H{"error": "Todo not found"})
		return
	}

	db.Model(&todo).Update("deleted", true)
	c.JSON(http.StatusOK, gin.H{"message": "Todo deleted"})
}


func main() {
	r := gin.Default()
    r.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"http://localhost:3000"},
        AllowMethods:     []string{"GET", "POST", "DELETE", "PUT", "OPTIONS"},
        AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
        AllowCredentials: true,
    }))
    initialDB()

	// データ追加
	r.POST("/todo", createTodo)
	// データ取得
	r.GET("/todo", getTodo)
	// データ削除
	r.DELETE("/todo/:id", deleteTodo)
	// サーバ起動
	r.Run(":8080")
}
